const router = require("express").Router();

const {
	createScheme,
	getScheme,
	getSchemeDetails,
	updateScheme,
	deleteScheme
} = require("../controllers/schemeController");


const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

// POST /schemes
router.post('/schemes', createScheme);

// GET schemes by subject
router.get('/schemes/subject/:subjectId', getScheme);
router.get('/schemes/:id', getSchemeDetails);

// PUT scheme by id
router.put('/schemes/:id', updateScheme);

// DELETE scheme by id
router.delete('/schemes/:id', deleteScheme);

module.exports = router;
