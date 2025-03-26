const express = require("express");
const {
  getAllCarts,
  addToCart,
  removeFromCart,
} = require("../controllers/cart.controller");
const router = express.Router();

router.get("/", getAllCarts);
router.post("/", addToCart);
router.delete("/:user_id/:product_id", removeFromCart);

module.exports = router;
