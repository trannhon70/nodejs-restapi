const express = require("express")
const router = express.Router()
const authorize = require("../middleware/authorize");
const {createProduct,updateProduct,deleteProduct,getpagingProduct,getByIdProduct} = require("../controllers/product.controller")

router.post("/create", authorize(), createProduct);
router.put("/update/:id", authorize(), updateProduct);
router.get("/getById/:id", authorize(), getByIdProduct);
router.delete("/delete/:id", authorize(), deleteProduct);
router.get("/getpaging", authorize(), getpagingProduct);




module.exports = router