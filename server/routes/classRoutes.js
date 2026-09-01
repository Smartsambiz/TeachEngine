const router = require("express").Router();

const classController = require("../controllers/classController");

// POST create classes
router.post('/classes', classController.createClasses);

// GET get classes by teacher
router.get('/classes/:teacherId', classController.getClassByTeacher);

module.exports = router