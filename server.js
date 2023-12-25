require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const userRoutes = require("./routes/user.router");
const errorHandler = require("./middlewares/error");

// Express App
const app = express();
const port = process.env.PORT || 5000;

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
  origin: [`${process.env.ADMIN_DEV_URL}`],
  preflightContinue: false,
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);

app.use("/", (req, res) => {
  return res.json({
    message: "Welcome to the Node.js REST API using ExpressJS and MongoDB"
  });
});

app.use(errorHandler);

const startServer = () => {
  try {
    // Connect to DB
    connectDB();

    // Start & Listen to the requests
    app.listen(port, () => console.log(`Server started listening on ${port}`));
  } catch (error) {
    console.log(error);
  }
};

startServer();