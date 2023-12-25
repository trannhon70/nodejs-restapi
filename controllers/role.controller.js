const RoleModel = require("../models/role.model");

const createRole = async (req, res, next) => {
  try {
    const check = RoleModel.findOne({ name: req.body.name });
    if (!check) {
      const result = await RoleModel.create({ ...req.body });
      return res.status(200).json({
        status: 1,
        message: "create role success!",
        data: result,
      });
    }
    return res.status(400).json({
      status: 0,
      message: "name check already exist!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json();
  }
};

const getAllRole = async (req, res, next) => {
  try {
    const result = await RoleModel.find();
    return res.status(200).json({
      status: 1,
      message: "create role success!",
      data: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json();
  }
};

module.exports = {
  createRole,
  getAllRole,
};
