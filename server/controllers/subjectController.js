const { createSubject, getSubjectsByClass, getSubjectById, updateSubjectByClass, deleteSubjectByClass } = require("../services/subjectServices");


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

    if(error){
     throw error;
   };

   res.status(200).json({
    message: "Subjects available",
    data
   })
};

const getSubjectDetails = async (req, res) => {
    const { data, error } = await getSubjectById(req.params.subjectId);
    if (error) throw error;
    if (!data) {
        const notFound = new Error("Subject not found");
        notFound.status = 404;
        throw notFound;
    }
    res.status(200).json({ message: "Subject available", data });
};

const updateSubject = async(req, res)=>{
    const id = req.params.subjectId;
    const { subjectName} = req.body;

    const { data, error }= await updateSubjectByClass(id, subjectName);
    if(error){
        throw error
    };
    if(!data || data.length === 0){
        const newError = new Error("Subject not found");
        newError.status = 404;
        throw newError;
    }

    res.status(200).json({
        message: "Update successfull",
        data
    });

};


const deleteSubject = async(req, res)=>{
    const id = req.params.subjectId;

    const {data, error }= await deleteSubjectByClass(id);
    if(error){
        const deleteError = new Error("This subject still has related schemes. Remove those records first, then try again.");
        deleteError.status = 409;
        throw deleteError;
    }
    res.status(200).json({
        message: "Deleted successfully",
        data: []
    })
};

module.exports = {
    createSubjectByClass,
    getSubject,
    getSubjectDetails,
    updateSubject, 
    deleteSubject
}

