const database = require("../supabaseClient");

const databaseFrom = database.from("topics");
let result = { data: null, error: null };

const createTopicProfile = async(title, objectives, week, schemeId)=>{
    const { data, error } = await databaseFrom.insert({
        title,
        objectives,
        week,
        scheme_id: schemeId
    }).select();

    result.data = data;
    result.error = error;
    return result;
};

const getTopicsByScheme = async(schemeId)=>{
    const { data, error } = await databaseFrom.select("*").eq("scheme_id", schemeId);

    result.data = data;
    result.error = error;
    return result;
};

const getTopicById = async(id)=>{
    const {data, error }= await databaseFrom.select("*").eq("id", id).single();

    result.data = data;
    result.error = error;
    return result
}

const updateTopicProfile = async(id, title, objectives, week)=>{
    const { data, error } = await databaseFrom.update({
        title,
        objectives,
        week
    }).eq("id", id).select();

    result.data = data;
    result.error = error;
    return result;
};

const deleteTopicProfile = async(id)=>{
    const { data, error } = await databaseFrom.delete().eq("id", id);

    result.data = data;
    result.error = error;
    return result;
};

module.exports = {
    createTopicProfile,
    getTopicsByScheme,
    getTopicById,
    updateTopicProfile,
    deleteTopicProfile
};
