const express = require("express");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const saucesCtrl = require("../controllers/sauces");

const router = express.Router();

router.get("/", auth, saucesCtrl.getAllSauces);
router.get("/:id", auth, saucesCtrl.getOneSauce);
router.post("/", auth, multer, saucesCtrl.createSauce);
router.put("/:id", auth, multer, saucesCtrl.modifySauce);
router.delete("/:id", auth, multer, saucesCtrl.deleteSauce);
router.post("/:id/like", auth, saucesCtrl.likeSauce);

module.exports = router;
