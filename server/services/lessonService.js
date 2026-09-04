const database = require("../supabaseClient");

const databaseFrom = database.from("lesson_notes");
let result = { data: null, error: null };

const saveLessonNote = async(content, status, topicId)=>{
    const { data, error } = await databaseFrom.insert({
        content: content,
        status: status,
        topic_id: topicId
    }).select();

    result.data = data;
    result.error = error;
    return result;
};

const getNoteByTopicId = async(topicId)=>{
    const { data, error } = await databaseFrom
        .select("*")
        .eq("topic_id", topicId);

    result.data = data && data.length > 0 ? data[0] : null;
    result.error = error;
    return result;
};

const updateLessonNote = async(id, content, status)=>{
    const updates = {};

    if(content !== undefined){
        updates.content = content;
    }
    if(status !== undefined){
        updates.status = status;
    }

    const { data, error } = await databaseFrom
        .update(updates)
        .eq("id", id)
        .select();

    result.data = data;
    result.error = error;
    return result;
};

const deleteLessonNote = async(id)=>{
    const { data, error } = await databaseFrom
        .delete()
        .eq("id", id);

    result.data = data;
    result.error = error;
    return result;
};

module.exports = {
    saveLessonNote,
    getNoteByTopicId,
    updateLessonNote,
    deleteLessonNote
};
