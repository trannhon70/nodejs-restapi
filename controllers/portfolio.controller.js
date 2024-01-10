
const portfolioModel = require("../models/portfolio.model");

const createPortfolio = async (req, res, next) => {
    try {
        const result = await portfolioModel.create({ ...req.body });
        return res.status(200).json({
          result,
          status: 1,
          message: "Gửi tin nhắn thành công!",
        });
    } catch (error) {
      console.log(error);
      return res.status(404).json();
    }
  };


  module.exports = {
    createPortfolio
  }