const router = require("express").Router();
const { createSubjectByClass, getSubject, getSubjectDetails, updateSubject, deleteSubject} = require("../controllers/subjectController");



const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

// POST /subjects
router.post('/subjects', createSubjectByClass);

// GET /subjectbyid
router.get('/subjects/class/:classId', getSubject);
router.get('/subjects/:subjectId', getSubjectDetails);

// PUT /subjectbyid
router.put('/subjects/:subjectId', updateSubject);

// DELETE /subject by id
router.delete('/subjects/:subjectId', deleteSubject);

module.exports = router