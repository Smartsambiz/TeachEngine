const database = require("../supabaseClient");

const registerTeacher = async (name, email)=>{
    
    const { data , error } = await database.from("teacher").insert({
        name, email
    });

    return { data, error }
};

const getAllTeachers = async ()=>{
    const result = await database.from("teacher").select("*");
    return result
}

const getTeacherById = async (id)=>{

    const { data, error} = await database.from("teacher").select("*").eq("id", id);

    return {data, error};
};

const updateTeacherById = async (newName, newEmail, id)=>{
    let result = { data: null, error: null};
    if(newName || newEmail){
        const { data, error } = await database.from("teacher").update({
            name: newName,
            email: newEmail,
        
        }).eq("id", id);
        result.data = data;
        result.error = error
    }

    return result
    
}

const deleteTeacherById = async (id)=>{
    const { data, error } = await database.from("teacher").delete().eq("id", id);
    return { data, error }
};


module.exports = {
    registerTeacher,
    getTeacherById,
    updateTeacherById,
    deleteTeacherById, 
    getAllTeachers
}