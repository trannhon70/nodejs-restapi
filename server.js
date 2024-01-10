require("dotenv").config();

const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require ('path');

const connectDB = require("./config/db");
const userRoutes = require("./routers/user.router");
const errorHandler = require("./middlewares/error");
const roleRouter = require("./routers/role.router")
const productRouter = require("./routers/product.router")
const brandRouter = require("./routers/brand.router");
const portRouter = require("./routers/portfolio.router");

// Express App
const app = express();
const port = process.env.PORT || 8000;

// middlewares
const corsOptions = {
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "X-Access-Token",
    "Authorization",
  ],
  credentials: true,
  methods: "GET, HEAD, OPTIONS, PUT, PATCH, POST, DELETE",
  origin: [`${process.env.ADMIN_DEV_URL}`, `${process.env.ADMIN_LOCAL_URL}`],
  preflightContinue: false,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, `uploads`)))

// Routes
app.use("/api/user", userRoutes);
app.use("/api/role", roleRouter);
app.use("/api/product", productRouter);
app.use("/api/brand", brandRouter);
app.use("/api/portfolio", portRouter);

// console.log(brandRouter,'portRouter');

app.use("/", (req, res) => {
  return res.json({
    message: "Welcome to the Node.js REST API using ExpressJS and MongoDB"
  });
});

app.use(errorHandler);
app.listen(port, ()=> {
  console.log(`Server is running on port ${port}`);
})

const startServer = () => {
  try {
    // Connect to DB
    connectDB();


    // Start & Listen to the requests
    // app.listen(port, () => console.log(`Server started listening on ${port}`));
  } catch (error) {
    console.log(error);
  }
};

startServer();