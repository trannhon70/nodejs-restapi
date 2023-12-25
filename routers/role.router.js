const express = require("express")
const router = express.Router()
const {createRole,getAllRole} = require("../controllers/role.controller")
const authorize = require("../middlewares/authorize");


router.post("/create", authorize(), createRole);
router.get("/getAll", authorize(), getAllRole);

module.exports = router