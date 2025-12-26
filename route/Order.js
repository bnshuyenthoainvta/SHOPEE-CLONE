const express = require("express");
const router = express.Router();
const orderController = require("../controller/oderController");

router.post("/", orderController.createOrder);
router.get("/:id", orderController.getOrder);
router.put("/:id", orderController.cancelOrder);

module.exports = router;