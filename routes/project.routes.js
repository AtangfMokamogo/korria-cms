const express = require('express');
const ProjectController = require('../controllers/project.controller');
const verifyToken = require('../middlewares/auth.mid');

const router = express.Router();

router.post('/new-project', verifyToken, ProjectController.newProject);
router.get('/user-projects', verifyToken, ProjectController.getProjects);
router.get('/delete-project', verifyToken, ProjectController.deleteProject);

module.exports = router;
