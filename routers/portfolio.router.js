const express = require("express")
const router = express.Router()
// const authorize = require("../middlewares/authorize");
const {createPortfolio} = require("../controllers/portfolio.controller")

router.post("/create", createPortfolio);

module.exports = router