const mongoose = require("mongoose")

const brandSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            unique: true,
            required: true,
        },
        
    },
    {
        timestamps: true
    }
)


brandSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      // remove these props when object is serialized
      delete ret._id;
      
    },
  });

module.exports = mongoose.model("Brand", brandSchema)