const router = require("express").Router();
const {
    createTopic,
    getTopics,
    getTopicDetails,
    updateTopic,
    deleteTopic
} = require("../controllers/topicsController");

const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

// POST /topics
router.post('/topics', createTopic);

// GET topics by scheme
router.get('/topics/scheme/:schemeId', getTopics);
router.get('/topics/:id', getTopicDetails);

// PUT topic by id
router.put('/topics/:id', updateTopic);

// DELETE topic by id
router.delete('/topics/:id', deleteTopic);

module.exports = router;
