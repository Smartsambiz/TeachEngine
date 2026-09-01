const teacherServices = require("../services/teacherServices");



// Post /teachers
const createTeacher = async (req, res, next)=>{
    try{
        const { name, email } = req.body;
        const { data, error } = await teacherServices.registerTeacher(name, email)

        if(error){
             const newError = error;
             newError.status = 404;
             throw newError
        }
        res.status(201).json({message: `Teacher created successult`, data});


    }catch(error){
        next(error);
    }
};

const getTeachers = async (req, res, next)=>{
    try{
        const { data, error } = await teacherServices.getAllTeachers();
    
        res.status(200).json({
            message: "Teachers available",
            data
        });
    } catch(err){
        console.log(err);
        next(err)
    }   
}



const getTeacher = async (req, res, next)=>{
    try{
        const id = req.params.id;
        const { data, error } = await teacherServices.getTeacherById(id);
        if(!data){
            console.log("error:", error);
            const custErr = new Error("teacher not found");
            custErr.status = 404;
            throw custErr;
        }
        console.log(data);
        res.status(200).json({message: `Teacher available `, data: data})
    }catch(err){
        console.log("internal server error: ", err);
        next(err)
    }
};

const updateTeacher = async (req, res, next)=>{
    try{
        const id = req.params.id;
        const { name, email} = req.body;

        if(!name && !email){
            const newError = new Error("No data provided for update");
            newError.status = 400;
            throw newError
        }


        const { data, error} = await teacherServices.updateTeacherById(name, email, id);
        if(!data || error){
            const databaseErr = new Error("Teacher does not exist");
            databaseErr.status = 400;
            throw databaseErr
        }
        res.status(200).json({message: "Updated successfully", data});

    } catch(err){
        console.log(err);
        next(err)
    }
};


const deleteTeacher = async (req, res, next)=>{
    try{
        const id = req.params.id;

        const { data, error} = await teacherServices.deleteTeacherById(id);
        res.status(200).json({message: "Deleted successfully", data});

    } catch(err){
        console.log(err);
        next(err)
    }
};

module.exports = {
    createTeacher,
    getTeachers,
    getTeacher,
    updateTeacher,
    deleteTeacher
}