const validateRequest = require("../middlewares/validate-request");
const userService = require("../services/user.service");
const Joi = require("joi");
const UserModal = require("../models/user.model")
const refreshToken = require("../models/refreshToken.model");
const userModel = require("../models/user.model");
const path = require("path");
const bcrypt = require("bcryptjs");
var nodemailer = require('nodemailer');
const mailer = require('../utils/mailer')

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nhontrau03@gmail.com',
    pass: '0968222502n'
  }
});

function authenticateSchema(req, res, next) {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });
  validateRequest(req, next, schema);
}

function setTokenCookie(res, token) {
  // create http only cookie with refresh token that expires in 7 days
  const cookieOptions = {
    httpOnly: false,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  };
  res.cookie("refreshToken", token, cookieOptions);
}

function authenticate(req, res, next) {
  const { username, password } = req.body;
  const ipAddress = req.ip;
  userService
    .authenticate({ username, password, ipAddress })
    .then(({ refreshToken, status, message, ...user }) => {
      setTokenCookie(res, refreshToken);
      const data = {
        status,
        data: status === 1 ? user : message,
      };

      res.json(data);
    })
    .catch((err) => console.log(err))
    .catch(next);
}

const register = async (req, res , next) => {
  try {
    const check = await UserModal.findOne({username: req.body.username})
    if(!check){
      const result = await UserModal.create({...req.body})
      return res.status(200).json({
        status: 1,
        message: "create success!",
        result
      })
    }
    return res.status(400).json({
      status: 0,
      message: "username check already exist!"
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json()
  }
}

const getByIdUser = async (req, res , next) => {
  try {
    const id = req.user.id
    if(id){
      const result = await UserModal.findById(id).populate('role')
      return res.status(200).json({
        status: 1,
        message: "get by id success!",
        result
      })
    }
    return res.status(404).json(
      {
        status: 0,
        message: "Id is not found!"
      }
    )
  } catch (error) {
    console.log(error);
    return res.status(500).json()
  }
}

const updateUser = async (req, res , next) => {
  try {
    const id = req.params.id
    if(id){
      const result = await UserModal.findByIdAndUpdate(id,{...req.body})
      return res.status(200).json({
        status: 1,
        message: "get by id success!",
        result
      })
    }
    return res.status(404).json(
      {
        status: 0,
        message: "Id is not found!"
      }
    )
  } catch (error) {
    console.log(error);
    return res.status(500).json()
  }
}

const deleteUser = async (req, res , next) => {
  try {
    const id = req.params.id
    if(id){
      const result = await UserModal.findByIdAndDelete(id)
      return res.status(200).json({
        status: 1,
        message: "Xóa người dùng thành công!",
        result
      })
    }
    return res.status(404).json(
      {
        status: 0,
        message: "Id is not found!"
      }
    )
  } catch (error) {
    console.log(error);
    return res.status(500).json()
  }
}

const getpagingUser = async (req, res , next) => {
  try {
    const pageSize = Number(req.query?.pageSize) || 10;
    const pageIndex = Number(req.query?.pageIndex) || 1;
    const search = req.query?.search || "";
    const searchObj = {
      role : '6568b01ec7741ba79aa6fcac'
    }
    if(req.query?.search){
      searchObj.$or = [
        { name: { $regex: new RegExp(search, 'i') } },
        { email: { $regex: new RegExp(search, 'i') } },
        { phone: { $regex: new RegExp(search, 'i') } }
      ];
    }

    const data = await UserModal.find(searchObj).skip(pageSize * pageIndex - pageSize)
    .limit(parseInt(pageSize)).sort({createdAt: "desc"})

    const count = await UserModal.find(searchObj).countDocuments();
    let totalPages = Math.ceil(count / pageSize);

    return res.status(200).json({
      pageIndex,
      pageSize,
      totalPages,
      data,
      count,
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json()
  }
}

const logout = async (req, res , next) => {
  try {
    const {userId} = req.body
    if(userId){
       await refreshToken.findOneAndDelete({user: userId})
      return res.status(200).json({status: 1})
    }
   
  } catch (error) {
    console.log(error);
    return res.status(500).json()
  }
}

const createUser = async (req, res , next) => {
  try {
   const {username, phone, email} = req.body;
   const timestamp = Date.now();
   const check = await userModel.findOne({ username });
   const checkPhone = await userModel.findOne({ phone });
   const checkEmail = await userModel.findOne({ email });
   if(checkPhone){
    return res.status(200).json({
      status: 0,
      message: "Số điện thoại đã được đăng ký!",
    });
   }
   if(checkEmail){
    return res.status(200).json({
      status: 0,
      message: "Email này đã được đăng ký!",
    });
   }

   if (!check) {
    let file = req.files?.file;
    const newName = `${timestamp}_${file?.name}`;
     if (req.files?.file) {
      
        
         file?.mv(path.join(__dirname, `../uploads/${newName}`), (err) => {
           console.log(err);
         });
         
     }
     const body = {
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password,10),
      name: req.body.name,
      date: req.body.date,
      email: req.body.email,
      role: req.body.role,
      phone: req.body.phone,
      address: req.body.address,
      avatar: newName,
    };
   
    
    const result = await userModel.create(body,(err, user)=> {
      if (!err) {
        bcrypt.hash(req.body.email, 10).then((hashedEmail) => {
            console.log(`${process.env.ADMIN_DEV_URL}/verify?email=${user.email}&token=${hashedEmail}`);
            mailer.sendMail(user.email, "Mail xác thực tài khoản của bạn", `<a href="${process.env.ADMIN_DEV_URL}/xac-thuc-tai-khoan?email=${user.email}&token=${hashedEmail}">Vui lòng click vào link này để xác thực tài khoản của bạn! </a>`)
        });
        
    }
    });
    return res.status(200).json({
      result,
      status: 1,
      message: "create product success!",
    });
   }

  
   return res.status(200).json({
     status: 0,
     message: "Tên đăng nhập đã tồn tại!",
   });
   
  } catch (error) {
    console.log(error);
    return res.status(500).json()
  }
}

const verify = async (req, res) => {
  bcrypt.compare(req.query.email, req.query.token, async (err, result) => {
    if (result === true) {
      try {
        const user = await userModel.findOne({ email: req.query.email });
        if (user) {
          user.emailVeryfied = true;
          const reusult = await user.save();
          return res.status(200).json({
            status: 1,
            reusult
          })
        }
      } catch (error) {
        console.error(error);
        res.redirect('/error');
      }
    } else {
      res.redirect('/404');
    }
  });
};

module.exports = {
  authenticateSchema,
  authenticate,
  register,
  getByIdUser,
  updateUser,
  deleteUser,
  getpagingUser,
  logout,
  createUser,
  verify
};
