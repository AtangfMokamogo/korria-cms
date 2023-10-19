const multer = require('multer');
const path = require('path');
const express = require('express');
const TypeController = require('../controllers/type.controller');
const verifyToken = require('../middlewares/auth.mid');
const { getParams } = require('../middlewares/query.params.mid');

const router = express.Router();

const basePath = '/home/fino/Documents/korria-cms';

/** setup path */
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(basePath, 'uploads/images/temp/'));
  },
  filename: (req, file, callback) => {
    callback(null, `${file.originalname}`);
  },
});

const upload = multer({ storage });
/** Image Field Defining Routes */
router.post('/:projectname/content/image/new', verifyToken, getParams, upload.single('file'), TypeController.addImage);
router.post('/:projectname/content/image/delete', verifyToken, getParams, TypeController.removeImage);
router.get('/:projectname/content/image/all', verifyToken, getParams, TypeController.getImages);

/** Text Field Defining Routes */
router.post('/:projectname/content/newText', verifyToken, getParams, TypeController.addText);

/** Image Content Routes */
router.get('/:projectname/images/:imagename', TypeController.serveImageFile);

module.exports = router;
