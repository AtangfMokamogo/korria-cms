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
router.post('/projects/:projectname/types/newImage', verifyToken, getParams, upload.single('file'), TypeController.addImage);

module.exports = router;
