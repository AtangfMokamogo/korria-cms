const express = require('express');
const OrderController = require('../controllers/order.controller');
const verifyToken = require('../middlewares/auth.mid');
const { getParams, getQueryId } = require('../middlewares/query.params.mid');

const router = express.Router();

router.post('/:projectname/orders/new', verifyToken, getParams, OrderController.newOrder);
router.post('/:projectname/orders/get_tagged', verifyToken, OrderController.getOrderByTags);
router.get('/:projectname/orders/get_id', getParams, getQueryId, verifyToken, OrderController.getOrderById);
router.get('/:projectname/orders/delete_order', getParams, getQueryId, OrderController.removeOrderById);

module.exports = router;
