const brandModel = require("../models/brand.model");

const createBrand = async (req, res, next) => {
  try {
    const name = req.body.name;
    const check = await brandModel.findOne({ name: name.trim() });
    if (!check || check === null) {
      const result = await brandModel.create({ ...req.body });
      return res.status(200).json({
        result,
        status: 1,
        message: "create brand name success!",
      });
    }
    return res.status(400).json({
      status: 0,
      message: "brand name check already exits!",
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json();
  }
};

const updateBrand = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (id) {
      const result = await brandModel.findByIdAndUpdate(id, { ...req.body });
      return res.status(200).json({
        status: 1,
        result,
        message: "update success!",
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

const deleteBrand = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (id) {
      const result = await brandModel.findByIdAndDelete(id);
      return res.status(200).json({
        status: 1,
        result,
        message: "Delete brand success!",
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

const getpagingBrand = async (req, res, next) => {
  try {
    const pageIndex = req.query.pageIndex || 1;
    const pageSize = req.query.pageSize || 10;
    const search = req.query.search || "";
    let searchObj = {};
    if (search) {
      searchObj.name = { $regex: new RegExp(search, 'i') };
    }
    const data = await brandModel.find(searchObj)
      .skip(pageSize * pageIndex - pageSize)
      .limit(parseInt(pageSize))
      .sort({ createdAt: "desc" });
    
    const count = await brandModel.find(searchObj).countDocuments();
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

const getBrandById = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (id) {
      const result = await brandModel.findById(id);
      return res.status(200).json({
        status: 1,
        result,
        message: "get brand by Id",
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

const getAllBrand = async (req, res, next) => {
  try {
      const result = await brandModel.find();
      return res.status(200).json({
        status: 1,
        result,
        message: "get brand by Id",
      });
   
  } catch (error) {
    console.log(error);
    return res.status(404).json();
  }
};
module.exports = {
  createBrand,
  updateBrand,
  deleteBrand,
  getpagingBrand,
  getBrandById,
  getAllBrand
};
