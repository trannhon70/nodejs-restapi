const express = require("express")
const router = express.Router()
const authorize = require("../middleware/authorize");
const {createBrand, updateBrand, deleteBrand,getpagingBrand,getBrandById, getAllBrand} = require("../controllers/brand.controller")

router.post("/create", authorize(), createBrand);
router.put("/update/:id", authorize(), updateBrand);
router.get("/getBrandById/:id", authorize(), getBrandById);
router.delete("/delete/:id", authorize(), deleteBrand)
router.get("/getpaging", authorize(), getpagingBrand)
router.get("/getAll", authorize(), getAllBrand)



module.exports = router