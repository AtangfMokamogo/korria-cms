const multer = require('multer');
const path = require('path');
const express = require('express');

function multerSetup(req) {
  /** setup path */
  const imagePath = path.join(__dirname, `uploads/${req.user.fullname}/images/${req.project}/`);
  const storage = multer.diskStorage({
    destination: imagePath,
    filename(req, file, callback) {
      callback(null, req.body.title + path.extname(file.originalname));
    },
  });

  return multer({ storage });
}
const upload = multerSetup(express.request);
module.exports = upload;
