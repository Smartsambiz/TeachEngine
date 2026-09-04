const {
    saveLessonNote,
    getNoteByTopicId,
    updateLessonNote,
    deleteLessonNote
} = require("../services/lessonService");
const aiService = require("../services/aiServices");
const {getTopicById} = require("../services/topicsServices");


const createLessonNote = async(req, res)=>{
    const { content, status, topicId } = req.body;

    if(!content || !topicId){
        const newError = new Error("Content and topic ID required");
        newError.status = 400;
        throw newError;
    }

    const { data, error } = await saveLessonNote(content, status, topicId);
    if(error){
        throw error;
    }

    res.status(201).json({
        message: "Lesson note saved successfully",
        data
    });
};

const getLessonNote = async(req, res)=>{
    const { topicId } = req.params;
    const { data, error } = await getNoteByTopicId(topicId);

    if(error){
        throw error;
    }

    if(!data){
        const newError = new Error("No lesson note found");
        newError.status = 404;
        throw newError;
    }

    res.status(200).json({
        message: "Lesson note available",
        data
    });
};

const editLessonNote = async(req, res)=>{
    const { id } = req.params;
    const { content, status } = req.body;

    if(content === undefined && status === undefined){
        const newError = new Error("Content or status required for update");
        newError.status = 400;
        throw newError;
    }

    const { data, error } = await updateLessonNote(id, content, status);
    if(error){
        throw error;
    }

    if(!data || data.length === 0){
        const newError = new Error("Lesson note not found");
        newError.status = 404;
        throw newError;
    }

    res.status(200).json({
        message: "Lesson note updated successfully",
        data
    });
};

const removeLessonNote = async(req, res)=>{
    const { id } = req.params;
    const { data, error } = await deleteLessonNote(id);

    if(error){
        throw error;
    }

    res.status(200).json({
        message: "Lesson note deleted successfully",
        data
    });
};


const generateAndSaveLessonNote = async(req, res)=>{
    const { topicId, studentLevel } = req.body;

    if(!topicId){
        const newError = new Error("Topic Id missing");
        newError.status = 400;
        throw newError;
    };
    const dbResponse = await getTopicById(topicId);
    if(dbResponse.error){
        throw dbResponse.error
    };

    if(!dbResponse.data|| dbResponse.data.length === 0){
        const newError = new Error("topic not available");
        newError.status = 400;
        throw newError
    }

    const dbData = dbResponse.data;
    const aiResponse = await aiService.generateLessonNote(dbData.title, dbData.objectives, dbData.week, studentLevel);
    const { data, error } = await saveLessonNote(aiResponse, 'draft', topicId);

    if(error){
        throw error
    }

    res.status(201).json({
        message: "lesson note generated successfully",
        data: data
    })



}

module.exports = {
    createLessonNote,
    getLessonNote,
    editLessonNote,
    removeLessonNote,
    generateAndSaveLessonNote
};
