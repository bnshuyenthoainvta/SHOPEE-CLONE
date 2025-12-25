const express = require("express");
const router = express.Router();
const categoryController = require("../controller/categoryController");
const upload = require("../utils/uploads");

router.post("/", upload.single("avatar"), categoryController.createCategory);
router.post("/:id", upload.single("avatar"), categoryController.updateCategory);
router.get("/", categoryController.getCategory);
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;