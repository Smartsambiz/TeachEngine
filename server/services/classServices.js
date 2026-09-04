const database = require("../supabaseClient");

const createClassProfile = async (className, academicTerm, teacherId )=>{
    let result = {data: null, error: null};
    
    const { data, error } = await database.from("class").insert({
        class_name: className,
        academic_term: academicTerm,
        teacher_id: teacherId
    }).select();
    result.data = data;
    result.error = error    

    

    return result
}


const getClassesByTeacher = async(teacherId)=>{
    const result = await database.from("class").select("*").eq("teacher_id", teacherId);
    return result
};

const updateClassProfile = async(id,className, academicTerm)=>{
    const result = await database.from("class").update({
        class_name: className,
        academic_term: academicTerm,
    }).eq("id", id).select();

    return result;
};

const deleteClassProfile = async (id)=>{
    const result = await database.from("class").delete().eq("id", id).select();
    return result
}

module.exports = {
    createClassProfile,
    getClassesByTeacher,
    updateClassProfile,
    deleteClassProfile
}