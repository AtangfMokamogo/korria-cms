const express = require('express');
const ParcelController = require('../controllers/parcel.controller');
const verifyToken = require('../middlewares/auth.mid');
const { getParams, getQueryId } = require('../middlewares/query.params.mid');

const router = express.Router();

router.post('/:projectname/parcel/types/new', verifyToken, getParams, ParcelController.newType);
router.get('/:projectname/parcel/types', verifyToken, getParams, ParcelController.getParcels);
router.get('/:projectname/parcel/types/delete', verifyToken, getParams, getQueryId, ParcelController.deleteParcel);
router.post('/:projectname/parcel/types/add_field', verifyToken, getParams, getQueryId, ParcelController.addTypeField);

module.exports = router;
