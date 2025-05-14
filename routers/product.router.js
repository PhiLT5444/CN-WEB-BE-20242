const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const {
  validateAddProduct,
  validateUpdateProduct,
  validateDeleteProduct,
} = require("../middleware/product.validator");

/**
 * @swagger
 * /api/products/categories:
 *   get:
 *     tags:
 *       - Category
 *     summary: Lấy danh sách tất cả các danh mục sản phẩm
 *     description: Trả về danh sách tất cả các danh mục hiện có trong hệ thống.
 *     responses:
 *       200:
 *         description: Thành công. Danh sách các danh mục.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: "Điện thoại"
 *                   description:
 *                     type: string
 *                     example: "Danh mục các sản phẩm điện thoại"
 *       500:
 *         description: Lỗi lấy danh sách danh mục
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Lỗi lấy danh sách danh mục"
 */
router.get("/categories", productController.getAllCategories);

/**
 * @swagger
 * /api/products:
 *   post:
 *     tags:
 *       - Product
 *     summary: Thêm sản phẩm mới
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên sản phẩm
 *                 example: "Điện thoại iPhone 14"
 *               price:
 *                 type: number
 *                 format: float
 *                 description: Giá sản phẩm
 *                 example: 1999.99
 *               stock:
 *                 type: integer
 *                 description: Số lượng tồn kho
 *                 example: 100
 *               description:
 *                 type: string
 *                 description: Mô tả sản phẩm
 *                 example: "Sản phẩm mới nhất của Apple"
 *               category_id:
 *                 type: integer
 *                 description: ID danh mục sản phẩm
 *                 example: 1
 *               branch_id:
 *                 type: integer
 *                 description: ID chi nhánh
 *                 example: 2
 *               discount:
 *                 type: number
 *                 format: float
 *                 description: Phần trăm giảm giá
 *                 example: 10.5
 *               image_url:
 *                 type: string
 *                 description: URL hình ảnh sản phẩm
 *                 example: "https://example.com/image.jpg"
 *     responses:
 *       201:
 *         description: Đã thêm sản phẩm thành công
 *       500:
 *         description: Lỗi thêm sản phẩm
 */
router.post("/", validateAddProduct, productController.addProduct);
/**
 * @swagger
 * /api/products/search:
 *   get:
 *     tags:
 *       - Product
 *     summary: Tìm kiếm sản phẩm
 *     parameters:
 *       - in: query
 *         name: keyword
 *         required: false
 *         description: Từ khóa tìm kiếm
 *         schema:
 *           type: string
 *       - in: query
 *         name: category
 *         required: false
 *         description: ID danh mục sản phẩm
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thành công
 *       500:
 *         description: Lỗi tìm kiếm sản phẩm
 */
router.get("/search", productController.searchProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     tags:
 *       - Product
 *     summary: Lấy thông tin sản phẩm theo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của sản phẩm
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thành công
 *       404:
 *         description: Không tìm thấy sản phẩm
 *       500:
 *         description: Lỗi lấy sản phẩm
 */
router.get("/:id", productController.getProductById);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     tags:
 *       - Product
 *     summary: Xóa sản phẩm
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của sản phẩm
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Đã xóa thành công
 *       500:
 *         description: Lỗi xóa sản phẩm
 */
router.delete("/:id", validateDeleteProduct, productController.deleteProduct);

/**
 * @swagger
 * /api/products/{id}/status:
 *   put:
 *     tags:
 *       - Product
 *     summary: Cập nhật thông tin sản phẩm (bao gồm cả trạng thái)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của sản phẩm
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *                 format: float
 *               stock:
 *                 type: integer
 *               image_url:
 *                 type: string
 *               description:
 *                 type: string
 *               discount:
 *                 type: number
 *                 format: float
 *               branch_id:
 *                 type: integer
 *               category_id:
 *                 type: integer
 *               is_deleted:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy sản phẩm
 *       500:
 *         description: Lỗi máy chủ
 */

router.put(
  "/:id/status",
  validateUpdateProduct,
  productController.updateProduct
);

/**
 * @swagger
 * /api/products/{id}/category:
 *   put:
 *     tags:
 *       - Product
 *     summary: Phân loại sản phẩm
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của sản phẩm
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đã phân loại sản phẩm thành công
 *       500:
 *         description: Lỗi phân loại sản phẩm
 */
router.put("/:id/category", productController.assignCategoryToProduct);

/**
 * @swagger
 * /api/products/categories:
 *   post:
 *     tags:
 *       - Category
 *     summary: Thêm danh mục mới
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID của danh mục (tùy chọn, nếu không sẽ tự động tăng)
 *                 example: 10
 *               name:
 *                 type: string
 *                 description: Tên danh mục
 *                 example: "Điện thoại"
 *               description:
 *                 type: string
 *                 description: Mô tả danh mục
 *                 example: "Danh mục các sản phẩm điện thoại"
 *     responses:
 *       201:
 *         description: Đã thêm danh mục thành công
 *       500:
 *         description: Lỗi thêm danh mục
 */
router.post("/categories", productController.createCategory);

/**
 * @swagger
 * /api/products/categories/{id}:
 *   delete:
 *     tags:
 *       - Category
 *     summary: Xóa danh mục
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của danh mục
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Đã xóa danh mục thành công
 *       500:
 *         description: Lỗi xóa danh mục
 */
router.delete("/categories/:id", productController.deleteCategory);

/**
 * @swagger
 * /api/products/stock/check:
 *   get:
 *     tags:
 *       - Product
 *     summary: Kiểm tra tồn kho sản phẩm
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm tồn kho thấp
 *       500:
 *         description: Lỗi kiểm tra tồn kho
 */
router.get("/stock/check", productController.checkStock);

/**
 * @swagger
 * /api/products/category/{category_id}:
 *   get:
 *     tags:
 *       - Product
 *     summary: Lấy danh sách sản phẩm theo danh mục
 *     parameters:
 *       - in: path
 *         name: category_id
 *         required: true
 *         description: ID của danh mục
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Thành công
 *       404:
 *         description: Không có sản phẩm nào trong danh mục này
 *       500:
 *         description: Lỗi máy chủ
 */
router.get("/category/:category_id", productController.getProductsByCategory);

/**
 * @swagger
 * /api/products/{id}/category:
 *   get:
 *     tags:
 *       - Product
 *     summary: Lấy danh mục của sản phẩm theo ID sản phẩm
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của sản phẩm
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Thành công
 *       404:
 *         description: Không tìm thấy sản phẩm hoặc danh mục
 *       500:
 *         description: Lỗi máy chủ
 */
router.get("/:id/category", productController.getCategoryOfProduct);

/**
 * @swagger
 * /api/products/{product_id}/add-to-cart/{user_id}:
 *   post:
 *     tags:
 *       - Cart
 *     summary: Thêm sản phẩm vào giỏ hàng theo ID sản phẩm và ID user
 *     parameters:
 *       - in: path
 *         name: product_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID sản phẩm cần thêm vào giỏ hàng
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID người dùng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *                 description: Số lượng muốn thêm (bắt buộc)
 *                 example: 2
 *     responses:
 *       200:
 *         description: Đã thêm sản phẩm vào giỏ hàng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: Product added to cart successfully
 *       400:
 *         description: Thiếu tham số
 *       500:
 *         description: Lỗi máy chủ
 */
router.post("/:product_id/add-to-cart/:user_id", productController.addToCart);

module.exports = router;
