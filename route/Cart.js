const express = require("express");
const router = express.Router();
const cartController = require("../controller/cartController");

router.post("/", cartController.addToCart);
router.post("/:id", cartController.updateCart);
router.get("/", cartController.getCart);
router.delete("/:id", cartController.deleteCart);

module.exports = router;