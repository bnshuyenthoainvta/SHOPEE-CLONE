const express = require("express");
const router = express.Router();
const productController = require("../controller/productController");
const upload = require("../utils/uploads");

router.post("/", upload.fields("product_images", 10), productController.createProduct);
router.post("/:id", upload.fields("product_images", 10), productController.updateProduct);
router.get("/", productController.getProduct);
router.get("/:id", productController.getProductById);
router.delete("/:id", productController.deleteProduct);

module.exports = router;