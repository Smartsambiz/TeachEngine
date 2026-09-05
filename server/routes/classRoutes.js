const router = require("express").Router();

const classController = require("../controllers/classController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

// POST create classes
router.post('/classes',  classController.createClasses);

// GET get classes by teacher
router.get('/classes', classController.getClassByTeacher);

// PUT update class by teacher
router.put('/classes/:id', classController.updateClassByTeacher);

// DELETE class by teacher
router.delete('/classes/:id', classController.deleteClassByTeacher);

module.exports = router