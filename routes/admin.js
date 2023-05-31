//routes/admin.js
const path = require('path');
const express = require('express');
const router = express.Router();
const rootDir = require('../util/path');
const adminController = require('../controller/admin');

//  /add-product is associated with localhost:3000/admin/add-product and only get request
// /admin/add-product =>GET
router.get('/add-product', adminController.getAddProduct);

// //admin/products =>GET
router.get('/products', adminController.getProducts);

//admin/add-product =>POST
//for handling post request we can use app.post or app.get or app.patch or app.post or app.delete or app.put
router.post('/add-product',adminController.postAddProduct);


router.get('/edit-product/:productId',adminController.getEditProduct);

router.post('/edit-product',adminController.postEditProduct);

router.post('/delete-product',adminController.postDeleteProduct);

exports.routes = router;