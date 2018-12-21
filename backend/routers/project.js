const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project');
const extractFile = require('../middleware/file');
const checkAuth = require('../middleware/check-auth');

Logger = 'router / project.js:';

router.post("/upload", checkAuth,
projectController.uploadProject
);

router.post("/update", checkAuth,
projectController.updateProject
);


router.post("/image",checkAuth,
extractFile,
projectController.uploadImage
);

router.get("/:id", projectController.getProject)

router.get("/projectsInfo/:username", projectController.getProjectsInfo)

router.delete("/images", checkAuth, projectController.deleteImages);

router.delete("/project/:projectId", checkAuth, projectController.deleteProject);

module.exports = router;

