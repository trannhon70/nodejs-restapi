const productModel = require("../models/product.model");
const path = require("path");

const createProduct = async (req, res, next) => {
  try {
    const name = req.body.name;
    const timestamp = Date.now();
    const check = await productModel.findOne({ name });
    if (!check) {
      var listImage = [];
      if (req.files?.file) {
        let file = req.files?.file;
        if (file.length > 0) {
          file?.map((item, index) => {
            const newName = `${timestamp}_${item.name}`;
            listImage.push(newName);
            item?.mv(path.join(__dirname, `../uploads/${newName}`), (err) => {
              console.log(err);
            });
          });
        } else {
          const newName = `${timestamp}_${file.name}`;
          listImage.push(newName);
          file?.mv(path.join(__dirname, `../uploads/${newName}`), (err) => {
            console.log(err);
          });
        }
      }
      const body = {
        name: req.body.name,
        brand: req.body.brand,
        price: req.body.price,
        content: req.body.content,
        quantity: req.body.quantity,
        content: req.body.content,
        image: listImage,
      };
      const result = await productModel.create(body);
      return res.status(200).json({
        result,
        status: 1,
        message: "create product success!",
      });
    }
    return res.status(400).json({
      status: 0,
      message: "Check name already exists!",
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json();
  }
};
const updateProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const timestamp = Date.now();
    
    if (id) {
      var listImage = [];
      if (req.files?.file) {
        let file = req.files?.file;
        if (file.length > 0) {
          file?.map((item, index) => {
            const newName = `${timestamp}_${item.name}`;
            listImage.push(newName);
            item?.mv(path.join(__dirname, `../uploads/${newName}`), (err) => {
              console.log(err);
            });
          });
        } else {
          const newName = `${timestamp}_${file.name}`;
          listImage.push(newName);
          file?.mv(path.join(__dirname, `../uploads/${newName}`), (err) => {
            console.log(err);
          });
        }
      }
      const body = {
        name: req.body.name,
        brand: req.body.brand,
        price: req.body.price,
        content: req.body.content,
        quantity: req.body.quantity,
        content: req.body.content,
        image: listImage,
      };

 
      const result = await productModel.findByIdAndUpdate(id,body);
      return res.status(200).json({
        result,
        status: 1,
        message: "Update product success!",
      });
    }
    return res.status(400).json({
      status: 0,
      message: "Id not found!",
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json();
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (id) {
      const result = await productModel.findByIdAndDelete(id);
      return res.status(200).json({
        result,
        status: 1,
        message: "Delete product success!",
      });
    }
    return res.status(400).json({
      status: 0,
      message: "Id not found!",
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json();
  }
};

const getpagingProduct = async (req, res, next) => {
  try {
    const pageIndex = req.query.pageIndex || 1;
    const pageSize = req.query.pageSize || 10;
    const search = req.query.search || "";
    const brand = req.query.brand || ""
    let searchObj = {};
    if (search) {
      searchObj.name = { $regex: new RegExp(search, 'i') };
    }

    if(brand){
      searchObj.brand = brand
    }

    const data = await productModel
      .find(searchObj)
      .populate('brand')
      .skip(pageSize * pageIndex - pageSize)
      .limit(parseInt(pageSize))
      .sort({ createdAt: "desc" });
    // if (data.length == 0) {
    //   pageIndex = 1;
    //   data = await productModel
    //     .find(searchObj)
    //     .skip(pageSize * pageIndex - pageSize)
    //     .limit(parseInt(pageSize))
    //     .sort({ createdAt: "desc" });
    // }
    const count = await productModel.find(searchObj).countDocuments();
    let totalPages = Math.ceil(count / pageSize);

    return res.status(200).json({
      data,
      pageIndex,
      pageSize,
      totalPages,
      count,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json();
  }
};

const getByIdProduct = async (req, res, next)=>{
  try {
    const id = req.params.id;
    if (id) {
      const result = await productModel.findById(id).populate('brand');
      return res.status(200).json({
        status: 1,
        result,
        message: "get product by Id",
      });
    }
    return res.status(400).json({
      status: 0,
      message: "Id not found!",
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json();
  }
}
module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getpagingProduct,
  getByIdProduct
};
