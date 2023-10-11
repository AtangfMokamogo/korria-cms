const express = require('express');
const ParcelController = require('../controllers/parcel.controller');
const verifyToken = require('../middlewares/auth.mid');
const { getParams, getQueryId } = require('../middlewares/query.params.mid');

const router = express.Router();

router.post('/projects/:projectname/parcel/types/new', verifyToken, getParams, ParcelController.newType);
router.get('/projects/:projectname/parcel/types', verifyToken, getParams, ParcelController.getParcels);
router.get('/projects/:projectname/parcel/types/delete', verifyToken, getParams, getQueryId, ParcelController.deleteParcel);
router.post('/projects/:projectname/parcel/types/new-field', verifyToken, getParams, getQueryId, ParcelController.addTypeField);

module.exports = router;
