const mongoose = require("mongoose");
const roleModel = require("../models/role.model");
const userModel = require("../models/user.model");
mongoose.set("strictQuery", false);

function initial(){
  userModel.estimatedDocumentCount((err, count)=>{
      if (!err && count == 0) {
          new userModel({
              username:"admin",
              password: bcrypt.hashSync("123123",10),
              name: "Trần Xuân Nhơn",
              role: "6568b01ec7741ba79aa6fcab",
              emailVeryfied: true
          }).save((err)=>{
              if (err) {
                  console.log("error", err);
                }
                console.log("add user admin");
          },
         
          )
          new userModel( {
            username:"User",
            password: bcrypt.hashSync("123123",10),
            name: "Trần Văn A",
            role: "User",
        }).save((err)=>{
            if (err) {
                console.log("error", err);
              }
              console.log("add user admin");
        }  )
      }
  })
  
  roleModel.estimatedDocumentCount((err,count)=>{
    if( !err && count === 0){
      new roleModel({
        name: "Admin", // bien tap vien
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'Editor' to roles collection");
      });
      new roleModel({
        name: "User", // bien tap vien
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'Editor' to roles collection");
      });
    }
  })
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB connected: ${conn.connection.host}`);
    initial();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;