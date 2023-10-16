const express = require('express');
const ProjectController = require('../controllers/project.controller');
const verifyToken = require('../middlewares/auth.mid');

const router = express.Router();

router.post('/new_project', verifyToken, ProjectController.newProject);
router.get('/user_projects', verifyToken, ProjectController.getProjects);
router.get('/delete_project', verifyToken, ProjectController.deleteProject);

module.exports = router;
