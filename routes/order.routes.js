const express = require('express');
const OrderController = require('../controllers/order.controller');
const verifyToken = require('../middlewares/auth.mid');
const { getParams, getQueryId } = require('../middlewares/query.params.mid');

const router = express.Router();

router.post('/projects/:projectname/orders/new', verifyToken, getParams, OrderController.newOrder);
router.get('/projects/:projectname/orders/get-tagged', verifyToken, OrderController.getOrderByTags);
router.get('/projects/:projectname/orders/get-id', getParams, getQueryId, verifyToken, OrderController.getOrderById);
router.get('/projects/:projectname/orders/delete-order', getParams, OrderController.removeOrderById);

module.exports = router;
