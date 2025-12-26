const express = require("express");
const router = express.Router();
const orderController = require("../controller/oderController");

router.post("/", orderController.createOrder);
router.get("/:id", orderController.getOrder);
router.delete("/:id", orderController.deleteOrder);

module.exports = router;