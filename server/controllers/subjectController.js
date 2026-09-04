const { createSubject, getSubjectsByClass, updateSubjectByClass, deleteSubjectByClass } = require("../services/subjectServices");


const createSubjectByClass = async (req, res, next)=>{
    try{
        const { subjectName, classId} = req.body;

        if(!subjectName){
            const newError = new Error("select subject name");
            newError.status = 404;
            throw newError;
        }

        const { data, error }= await createSubject(subjectName, classId);
        if(error){
            throw error
        }
        res.status(201).json({
            message: `${subjectName} created successfully`,
            data
        })
    } catch(err){
        console.log(err);
        next(err)
    }
};


const getSubject = async (req, res )=>{
   const classId = req.params.classId;

   const { data, error } = await getSubjectsByClass(classId);

   if(data.length === 0|| error){
    throw error
   };

   res.status(200).json({
    message: "Subjects available",
    data
   })
};

const updateSubject = async(req, res)=>{
    const id = req.params.id;
    const { subjectName} = req.body;

    const { data, error }= await updateSubjectByClass(id, subjectName);
    if(data.length=== 0||error){
        throw error
    };

    res.status(200).json({
        message: "Update successfull",
        data
    });

};


const deleteSubject = async(req, res)=>{
    const id = req.params.id;

    const {data, error }= await deleteSubjectByClass(id);
    res.status(200).json({
        message: "Deleted successfully",
        data: []
    })
};

module.exports = {
    createSubjectByClass,
    getSubject,
    updateSubject, 
    deleteSubject
}

