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

const getClassByTeacher = async(req, res)=>{
    
        const teacherId = req.user.id;
        const { data, error} = await classService.getClassesByTeacher(teacherId);
        if(error){
            throw error;
        }
        res.status(200).json({
            message: "success",
            data
        });

    
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
        if(error){
            throw error;
        }
        if(!data || data.length === 0){
            const newError = new Error("Class not found");
            newError.status = 404;
            throw newError;
        };

        res.status(200).json({
            message: `Class ${className} updated successfully`,
            data
        })
    }catch(err){
        console.log(err);
        next(err);
    }   
    

};

const deleteClassByTeacher = async(req, res, next)=>{
    try{
        const id = req.params.id;
        const { data, error } = await classService.deleteClassProfile(id);
        if(error){
            const deleteError = new Error("This class still has related subjects. Remove those records first, then try again.");
            deleteError.status = 409;
            throw deleteError;
        }
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