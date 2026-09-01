const classService = require("../services/classServices");

const createClasses = async(req, res, next)=>{

    try{
        const { className, academicYear, teacherId} = req.body;
        const { data, error} = await classService.createClassProfile(className, academicYear, teacherId);
        res.status(201).json({
            message: "class created successfully",
            data
        })
    }catch(err){
        console.log(err)
        next(err);
    }
};

const getClassByTeacher = async(req, res, next)=>{
    try{
        const teacherId = req.params.teacherId;
        const { data, error} = await classService.getClassesByTeacher(teacherId);
        if(!data || data.length === 0 || error){
            const newError = new Error("No class found");
            newError.status = 404;
            throw newError
        }
        res.status(200).json({
            message: "success",
            data
        });

    }catch(err){
        next(err)
    }
};

module.exports = {
    createClasses,
    getClassByTeacher
}