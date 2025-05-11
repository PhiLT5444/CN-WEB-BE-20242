/**
 * @swagger
 * tags:
 *   name: User
 *   description: API quản lý người dùng
 */

const express = require("express");
const UserController = require("../controllers/UserController");
const { authenticate, roleRequired } = require("../middleware/auth");
const router = express.Router();

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     tags:
 *       - User
 *     summary: Đăng nhập
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email của người dùng
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 description: Mật khẩu của người dùng
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *       404:
 *         description: Sai email hoặc mật khẩu
 */
router.post("/login", UserController.handleLogin);

/**
 * @swagger
 * /api/users/createUser:
 *   post:
 *     tags:
 *       - User
 *     summary: Tạo tài khoản mới
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Tên người dùng
 *                 example: "newuser"
 *               email:
 *                 type: string
 *                 description: Email của người dùng
 *                 example: "newuser@example.com"
 *               password:
 *                 type: string
 *                 description: Mật khẩu của người dùng
 *                 example: "password123"
 *               role:
 *                 type: string
 *                 description: Vai trò của người dùng (admin/customer/shipper)
 *                 example: "customer"
 *               full_name:
 *                 type: string
 *                 description: Họ và tên của người dùng
 *                 example: "Nguyen Van A"
 *               phone_number:
 *                 type: string
 *                 description: Số điện thoại của người dùng
 *                 example: "0123456789"
 *               address:
 *                 type: string
 *                 description: Địa chỉ của người dùng
 *                 example: "123 Main Street"
 *               gender:
 *                 type: string
 *                 description: Giới tính của người dùng (male/female/other)
 *                 example: "male"
 *     responses:
 *       200:
 *         description: Tạo tài khoản thành công
 *       400:
 *         description: Lỗi khi tạo tài khoản
 */
router.post("/createUser", UserController.createUser);

/**
 * @swagger
 * /api/users/changePassword:
 *   post:
 *     tags:
 *       - User
 *     summary: Đổi mật khẩu
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPW:
 *                 type: string
 *                 description: Mật khẩu cũ
 *                 example: "oldpassword123"
 *               newPW:
 *                 type: string
 *                 description: Mật khẩu mới
 *                 example: "newpassword123"
 *               confirmPW:
 *                 type: string
 *                 description: Xác nhận mật khẩu mới
 *                 example: "newpassword123"
 *     responses:
 *       200:
 *         description: Đổi mật khẩu thành công
 *       400:
 *         description: Lỗi khi đổi mật khẩu
 */
router.post("/changePassword/", authenticate, UserController.changePassword);

/**
 * @swagger
 * /api/users/getAllUser:
 *   get:
 *     tags:
 *       - User
 *     summary: Lấy danh sách tất cả người dùng
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID của người dùng
 *                   username:
 *                     type: string
 *                     description: Tên người dùng
 *                   email:
 *                     type: string
 *                     description: Email của người dùng
 *                   role:
 *                     type: string
 *                     description: Vai trò của người dùng
 *                   status:
 *                     type: string
 *                     description: Trạng thái của người dùng (active/banned/deleted)
 *                   full_name:
 *                     type: string
 *                     description: Họ và tên của người dùng
 *                   phone_number:
 *                     type: string
 *                     description: Số điện thoại của người dùng
 *                   address:
 *                     type: string
 *                     description: Địa chỉ của người dùng
 *                   gender:
 *                     type: string
 *                     description: Giới tính của người dùng
 *       403:
 *         description: Không có quyền truy cập
 */
router.get(
  "/getAllUser",
  authenticate,
  roleRequired("admin"),
  UserController.displayAllUser
);

/**
 * @swagger
 * /api/users/getUserById/{id}:
 *   get:
 *     tags:
 *       - User
 *     summary: Lấy thông tin người dùng theo ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của người dùng
 *     responses:
 *       200:
 *         description: Thông tin người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID của người dùng
 *                 username:
 *                   type: string
 *                   description: Tên người dùng
 *                 email:
 *                   type: string
 *                   description: Email của người dùng
 *                 role:
 *                   type: string
 *                   description: Vai trò của người dùng
 *                 status:
 *                   type: string
 *                   description: Trạng thái của người dùng
 *                 full_name:
 *                   type: string
 *                   description: Họ và tên của người dùng
 *                 phone_number:
 *                   type: string
 *                   description: Số điện thoại của người dùng
 *                 address:
 *                   type: string
 *                   description: Địa chỉ của người dùng
 *                 gender:
 *                   type: string
 *                   description: Giới tính của người dùng
 *       404:
 *         description: Không tìm thấy người dùng
 */
router.get("/getUserById/:id", authenticate, UserController.getEditInformation);

/**
 * @swagger
 * /api/users/userUpdate:
 *   post:
 *     tags:
 *       - User
 *     summary: Cập nhật thông tin người dùng
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Tên người dùng mới
 *                 example: "updateduser"
 *               email:
 *                 type: string
 *                 description: Email mới
 *                 example: "updateduser@example.com"
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       400:
 *         description: Lỗi khi cập nhật
 */
router.post("/userUpdate/", authenticate, UserController.updateUser);

/**
 * @swagger
 * /api/users/punish/{id}:
 *   post:
 *     tags:
 *       - User
 *     summary: Cấm người dùng
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của người dùng
 *     responses:
 *       200:
 *         description: Cấm người dùng thành công
 *       400:
 *         description: Lỗi khi cấm người dùng
 */
router.post(
  "/punish/:id",
  authenticate,
  roleRequired("admin"),
  UserController.getPunishmentOnUser
);

/**
 * @swagger
 * /api/users/userDelete/{id}:
 *   post:
 *     tags:
 *       - User
 *     summary: Xóa người dùng
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của người dùng
 *     responses:
 *       200:
 *         description: Xóa người dùng thành công
 *       400:
 *         description: Lỗi khi xóa người dùng
 */
router.post(
  "/userDelete/:id",
  authenticate,
  roleRequired("admin"),
  UserController.deleteUser
);

module.exports = router;
