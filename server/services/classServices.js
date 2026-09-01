const database = require("../supabaseClient");

const createClassProfile = async (className, academicTerm, teacherId )=>{
    let result = {data: null, error: null};
    
    const { data, error } = await database.from("class").insert({
        class_name: className,
        academic_year: academicTerm,
        teacher_id: teacherId
    });
    result.data = data;
    result.error = error    

    

    return result
}


const getClassesByTeacher = async(teacherId)=>{
    const result = await database.from("class").select("*").eq("teacher_id", teacherId);
    return result
};

module.exports = {
    createClassProfile,
    getClassesByTeacher
}