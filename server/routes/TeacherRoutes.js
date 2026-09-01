const router = require("express").Router();
const {createTeacher, getTeacher, updateTeacher, deleteTeacher, getTeachers} = require("../controllers/teacherController");
const { getAllTeachers } = require("../services/teacherServices");

// Post /teacher
router.post('/teacher', createTeacher);

// GET /teachers
router.get('/allteachers', getTeachers);

// GET /teacher
router.get('/teacher/:id', getTeacher);


module.exports = router