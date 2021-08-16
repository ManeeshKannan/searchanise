const express = require("express");
const productController = require('../Controller/ProductController')

const router = express.Router();


router.route("/product").get(productController.getProductFromSearchise);


module.exports = router;