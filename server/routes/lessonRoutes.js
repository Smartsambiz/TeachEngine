const router = require("express").Router();
const {
    createLessonNote,
    getLessonNote,
    editLessonNote,
    removeLessonNote,
    generateAndSaveLessonNote
} = require("../controllers/lessonController");

const authMiddleware = require("../middleware/authMiddleware");



router.use(authMiddleware);

// POST /lesson-notes
router.post('/lesson', createLessonNote);
// POST ai
router.post('/lesson/generate', generateAndSaveLessonNote);

// GET lesson note by topic
router.get('/lesson/topic/:topicId', getLessonNote);

// PUT lesson note by id
router.put('/lesson/:id', editLessonNote);

// DELETE lesson note by id
router.delete('/lesson/:id', removeLessonNote);

module.exports = router;
