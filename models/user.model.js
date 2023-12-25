const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
    {
        username:{
            type: String,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            required: true
        },
        name:{
            type: String,
            required: true
        },
        date: {
            type: Date,
        },
        email:{
            type: String,
            unique: true,
        },
        emailVeryfied:{
            type: Boolean,
            default: false
        },
        phone:{
            type: String,
            unique: true,
        },
        address:{
            type: String
        },
        role: {
            type : mongoose.Types.ObjectId,  ref: 'Role'
        },
        avatar: {
            type: String
        }
    },
    {
        timestamps: true
    }
)


userSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      // remove these props when object is serialized
      delete ret._id;
      delete ret.password;
    },
  });

module.exports = mongoose.model("User", userSchema)