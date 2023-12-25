const mongoose = require("mongoose")

const roleSchema = new mongoose.Schema(
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


roleSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      // remove these props when object is serialized
      delete ret._id;
      
    },
  });

module.exports = mongoose.model("Role", roleSchema)