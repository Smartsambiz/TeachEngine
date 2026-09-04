const database = require("../supabaseClient");
const teacherService = require("../services/teacherServices")

const register = async(req, res)=>{
    const { name, email, password} = req.body;

    const authResult = await database.auth.signUp({ email, password});

    if(authResult.error){
        throw authResult.error
    }
    
    const teacher = await teacherService.registerTeacher(authResult.data.user.id, name, email);
    res.status(201).json({
        message: "created",
        data: teacher.data
    })




};


const login = async(req, res)=>{
    const { email, password } = req.body;
    if(!email || !password){
        const newError = new Error("email and password required");
        newError.status = 401;
        throw newError;
    };

    const authResult = await database.auth.signInWithPassword({email, password});
    if(authResult.error){
        console.log(authResult.error);
        const newError = new Error("Unauthorized error");
        newError.status = 401;
        throw newError;
    };

    const teacherAvailable = await teacherService.getTeacherById(authResult.data.user.id);
    res.status(200).json({
        session: authResult.data.session.access_token,
        user: authResult.data.user,
        teacher: teacherAvailable.data?.[0] || null
    })
}

module.exports = {
    register, 
    login
}