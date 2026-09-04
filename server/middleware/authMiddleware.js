const database = require("../supabaseClient");

const authMiddleware = async(req, res, next)=>{
    const header = req.headers.authorization;

    if(!header){
        const newError = new Error("Authorization token required");
        newError.status = 401;
        throw newError
    };

    const splittedHeader = header.split(" ");
    if(splittedHeader[0]!== "Bearer"){
        const newError = new Error("not Bearer");
        newError.status = 401;
        throw newError
    };

    if(!splittedHeader[1]){
        const newError = new Error("token required");
        newError.status = 401;
        throw newError
    };

    const token = splittedHeader[1];
    const {data, error } = await database.auth.getUser(token);

    if(error){
        throw error
    };
    if(!data|| !data.user){
        const newError  = new Error("Unauthorized: Invalid or expired token");
        newError.status = 401;
        throw newError
    };
    

    req.user = data.user

    next()
   
};

module.exports = authMiddleware

