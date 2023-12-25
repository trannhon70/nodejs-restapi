const express = require("express")
const router = express.Router()
const {authenticateSchema, authenticate,register,getByIdUser,updateUser,deleteUser,getpagingUser,logout, createUser, verify} = require("../controllers/user.controller")
const authorize = require("../middlewares/authorize");

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Đăng nhập
 *     description: Đăng nhập với tên người dùng và mật khẩu
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       400:
 *         description: Lỗi trong quá trình xác thực
 */
router.post("/login", authenticateSchema, authenticate);

/**
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: Đăng ký
 *     description: Đăng ký với tên người dùng và mật khẩu mới
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: example_user
 *               password:
 *                 type: string
 *                 example: example_password
 *               name:
 *                 type: string
 *                 example: John Doe
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 username:
 *                   type: string
 *                 name:
 *                   type: string
 *       400:
 *         description: Lỗi trong quá trình đăng ký người dùng
 */
router.post("/register", register);
router.post("/create-user", createUser);
router.get("/verify", verify);

/**
 * @swagger
 * /api/user/getbyId/{id}:
 *   get:
 *     summary: Lấy thông tin người dùng theo ID
 *     description: Lấy thông tin người dùng từ cơ sở dữ liệu dựa trên ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của người dùng
 *         schema:
 *           type: ObjectId
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: ObjectId
 *                 username:
 *                   type: string
 *                 name:
 *                   type: string
 *       404:
 *         description: Người dùng không tồn tại
 */
router.get("/getbyId",authorize(), getByIdUser);

router.put("/update/:id", updateUser);
router.delete("/delete/:id", deleteUser);
router.get("/getpaging", getpagingUser);
router.post("/logout", logout);

module.exports = router