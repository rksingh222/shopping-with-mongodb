const path = require('path');
const express = require('express');
const router = express.Router();
const rootDir = require('../util/path');
const adminData = require("./admin");
const shopController = require('../controller/shop');

//get post will actually to do exact match  instead if we use router.use() it will work differently
router.get('/',shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId',shopController.getProduct);

router.get('/cart', shopController.getCart);

router.post('/cart', shopController.postCart);

router.post('/cart-delete-item', shopController.postCartDeleteProduct);

router.get('/orders', shopController.getOrders);

router.post('/create-order', shopController.postOrders);

// router.get('/checkout', shopController.getCheckout);
 
module.exports = router;
