const express = require('express');
const ProjectController = require('../controllers/project.controller');
const verifyToken = require('../middlewares/auth.mid');

const router = express.Router();

router.post('/new', verifyToken, ProjectController.newProject);

module.exports = router;
