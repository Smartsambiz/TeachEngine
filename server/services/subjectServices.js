const database = require("../supabaseClient");

const databaseFrom = database.from("subjects");
let result = { data: null, error: null};

const createSubject = async(subjectName, classId)=>{
    

    const { data, error} = await databaseFrom.insert({
        subject_name: subjectName,
        class_id: classId
    }).select();

    result.data = data;
    result.error = error;
    return result
};


const getSubjectsByClass = async(classId)=>{
    
    const {data, error }= await databaseFrom.select("*").eq("class_id", classId);

    result.data = data;
    result.error = error;
    return result
};


const updateSubjectByClass = async(id, subjectName)=>{
    const { data, error } = await databaseFrom.update({
        subject_name: subjectName
    }).eq("id", id).select();
    result.data = data;
    result.error = error;
    return result
};

const deleteSubjectByClass = async(id)=>{
    const {data, error} = await databaseFrom.delete().eq("id", id);
    result.data = data;
    result.error = error;
    return result
};


module.exports = {
    createSubject,
    getSubjectsByClass,
    updateSubjectByClass,
    deleteSubjectByClass
}