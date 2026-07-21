const express = require("express");
const router = express.Router();

const productsController = require("../controllers/products.controller");

/**
 * GET ALL PRODUCTS
 * Optional filters: category, subcategory
 */

router.get("/", productsController.getProducts);

/**
 * GET SINGLE PRODUCT BY ID
 */

router.get("/:id", productsController.getProduct);


module.exports = router;