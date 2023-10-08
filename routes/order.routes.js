const express = require('express');
const OrderController = require('../controllers/order.controller');
const verifyToken = require('../middlewares/auth.mid');
const { getParams } = require('../middlewares/query.params.mid');

const router = express.Router();

router.post('/projects/:projectname/orders/new', verifyToken, getParams, OrderController.newOrder);

module.exports = router;
