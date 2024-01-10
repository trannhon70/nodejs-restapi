const mongoose = require("mongoose")

const portfolioSchema = new mongoose.Schema(
    {
        name:{
            type: String,
        },
        email:{
            type: String,
        },
        subject:{
            type: String,
        },
        message:{
            type: String,
        },
    },
    {
        timestamps: true
    }
)


portfolioSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      // remove these props when object is serialized
      delete ret._id;
      
    },
  });

module.exports = mongoose.model("Portfolio", portfolioSchema)