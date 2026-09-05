const {
    createTopicProfile,
    getTopicsByScheme,
    updateTopicProfile,
    deleteTopicProfile
} = require("../services/topicsServices");

const createTopic = async(req, res)=>{
    const { title, objectives, week, schemeId } = req.body;

    if(!title || !objectives || week === undefined || !schemeId){
        const newError = new Error("Title, objectives, week and scheme ID required");
        newError.status = 400;
        throw newError;
    }

    const { data, error } = await createTopicProfile(title, objectives, week, schemeId);
    if(error){
        throw error;
    }

    res.status(201).json({
        message: `Topic ${title} created successfully`,
        data
    });
};

const getTopics = async(req, res)=>{
    const { schemeId } = req.params;
    const { data, error } = await getTopicsByScheme(schemeId);

    if(error){
        throw error;
    }

    if(!data){
        const newError = new Error("Unable to load topics");
        newError.status = 500;
        throw newError;
    }

    res.status(200).json({
        message: "Topics available",
        data
    });
};

const getTopicDetails = async (req, res) => {
    const { data, error } = await require("../services/topicsServices").getTopicById(req.params.id);
    if (error) throw error;
    if (!data) {
        const notFound = new Error("Topic not found");
        notFound.status = 404;
        throw notFound;
    }
    res.status(200).json({ message: "Topic available", data });
};

const updateTopic = async(req, res)=>{
    const { id } = req.params;
    const { title, objectives, week } = req.body;

    if(!title || !objectives || week === undefined){
        const newError = new Error("Title, objectives and week required");
        newError.status = 400;
        throw newError;
    }

    const { data, error } = await updateTopicProfile(id, title, objectives, week);
    if(error){
        throw error;
    }

    if(!data || data.length === 0){
        const newError = new Error("Topic not found");
        newError.status = 404;
        throw newError;
    }

    res.status(200).json({
        message: "Topic updated successfully",
        data
    });
};

const deleteTopic = async(req, res)=>{
    const { id } = req.params;
    const { data, error } = await deleteTopicProfile(id);

    if(error){
        throw error;
    }

    res.status(200).json({
        message: "Topic deleted successfully",
        data
    });
};

module.exports = {
    createTopic,
    getTopics,
    getTopicDetails,
    updateTopic,
    deleteTopic
};
