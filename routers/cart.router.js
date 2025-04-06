const express = require("express");
const {
  getAllCarts,
  addToCart,
  removeFromCart,
} = require("../controllers/cart.controller");
const router = express.Router();

/**
 * @swagger
 * /api/carts:
 *   get:
 *     tags:
 *       - Cart
 *     summary: Lấy danh sách giỏ hàng
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get("/", getAllCarts);
/**
 * @swagger
 * /api/carts:
 *   post:
 *     tags:
 *       - Cart
 *     summary: Thêm sản phẩm vào giỏ hàng
 *     responses:
 *       201:
 *         description: Đã thêm thành công
 */
router.post("/", addToCart);
/**
 * @swagger
 * /api/carts/{user_id}/{product_id}:
 *   delete:
 *     tags:
 *       - Cart
 *     summary: Xóa sản phẩm khỏi giỏ hàng
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         description: ID của người dùng
 *         schema:
 *           type: string
 *       - in: path
 *         name: product_id
 *         required: true
 *         description: ID của sản phẩm
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Đã xóa thành công
 */
router.delete("/:user_id/:product_id", removeFromCart);

module.exports = router;
