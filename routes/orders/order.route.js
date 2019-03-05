const express = require('express');
const orderCtrl = require('./order.controller');

const router = express.Router();

router
  .route('/')
  /** GET /api/orders - Get list of orders */
  .get(orderCtrl.list)
  .post(orderCtrl.create);


router
    .route('/:id/complete')
    /** POST /api/orders/:id/complete - Mark an order as completed */
    .post(orderCtrl.complete);
    

router.route('/seed')
    /** GET /api/orders/seed - Add dummy data */
    .post(orderCtrl.seed);

module.exports = router;
