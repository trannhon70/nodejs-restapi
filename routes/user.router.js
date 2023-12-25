const express = require("express")
const router = express.Router()
const {authenticateSchema, authenticate,register,getByIdUser,updateUser,deleteUser,getpagingUser,logout, createUser, verify} = require("../controllers/user.controller")
const authorize = require("../middlewares/authorize");


router.post("/login", authenticateSchema, authenticate);


router.post("/register", register);
router.post("/create-user", createUser);
router.get("/verify", verify);


router.get("/getbyId",authorize(), getByIdUser);

router.put("/update/:id", updateUser);
router.delete("/delete/:id", deleteUser);
router.get("/getpaging", getpagingUser);
router.post("/logout", logout);

module.exports = router