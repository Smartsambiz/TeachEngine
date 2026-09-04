const classService = require("../services/classServices");

const createClasses = async(req, res)=>{


    const { className, academicYear} = req.body;
    const teacherId = req.user.id
    const { data, error} = await classService.createClassProfile(className, academicYear, teacherId);
    if(data== null|| error){
        const newError = new Error("class creation failed");
        newError.status = 404;
        throw newError;

    }
    res.status(201).json({
        message: "class created successfully",
        data
    })
    
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

const updateClassByTeacher = async(req, res, next)=>{

    try{
        const { className, academicYear } = req.body;
        const id = req.params.id;

        if(!className && !academicYear){
            const newError = new Error("class name and academic year is needed for update");
            newError.status = 400;
            throw newError
        };

        const { data, error } = await classService.updateClassProfile(id, className, academicYear);
        if(!data || error){
            const newError = new Error(error);
            throw error;
        };

        res.status(200).json({
            message: `Class ${className} updated successfully`,
            data
        })
    }catch(err){
        console.log(err);
        next(err);s
    }   
    

};

const deleteClassByTeacher = async(req, res, next)=>{
    try{
        const id = req.params.id;
        const { data, error } = await classService.deleteClassProfile(id);
        res.status(200).json({
            message: "Class deleted successfully",
            data
        })
    }catch(err){
        next(err)
    }
}

module.exports = {
    createClasses,
    getClassByTeacher,
    updateClassByTeacher,
    deleteClassByTeacher
}