const express = require('express');
const orderCtrl = require('./order.controller');

const router = express.Router();

router
    .route('/')
    /** GET /api/orders - Get list of orders */
    .get(orderCtrl.list)
    .post(orderCtrl.create);

router
    .route('/in-progress')
    /** GET /api/orders/in-progress - Get all orders that aren't completed */
    .get(orderCtrl.listInProgress);

router
    .route('/:id/complete')
    /** POST /api/orders/:id/complete - Mark an order as completed */
    .post(orderCtrl.complete);

router
    .route('/:id')
    /** PATCH /api/orders/:id - Add items to an order*/
    .patch(orderCtrl.update);

router
    .route('/seed')
    /** GET /api/orders/seed - Add dummy data */
    .post(orderCtrl.seed);

module.exports = router;
