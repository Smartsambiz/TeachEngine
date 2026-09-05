const database = require("../supabaseClient");

let results = {data: null, error: null};
const databaseFrom = database.from("scheme_of_work");

const createSchemeProfile = async(term, academicYear, subjectId)=>{
    const { data, error } = await databaseFrom.insert({
        term: term,
        academic_year: academicYear,
        subject_id: subjectId
    }).select();
    results.data = data;
    results.error = error;
    return results
};


const getSchemeBySubject = async(subjectId)=>{
    const { data, error }= await databaseFrom.select("*").eq("subject_id", subjectId);
    results.data = data;
    results.error = error;
    return results
};

const getSchemeById = async(id)=>{
    const { data, error } = await databaseFrom.select("*").eq("id", id).single();
    return { data, error };
};

const updateSchemeProfile = async(id , term, academicYear)=>{
    const { data, error } = await databaseFrom.update({
        term: term,
        academic_year: academicYear,
    }).eq("id", id).select();

    results.data = data;
    results.error = error;
    return results;
};

const deleteSchemeProfile = async(id)=>{
    const {data, error } = await databaseFrom.delete().eq("id", id);

    results.data = data;
    results.error = error;
    return results;
};


module.exports = {
    createSchemeProfile,
    getSchemeBySubject,
    getSchemeById,
    updateSchemeProfile,
    deleteSchemeProfile
}