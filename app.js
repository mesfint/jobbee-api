const express = require("express");
const app = express();
const dotenv = require("dotenv"); // req dotenv package
const bodyParser = require("body-parser");
const jobsRouter = require("./routes/jobs");
const authRouter = require("./routes/auth");
const validator = require("validator");
const errorMiddlewares = require("./middlewares/errors");
const ErrorHandler = require("./utils/errorHandler");

const connectDatabase = require("./config/database");

//settingup config file variable
dotenv.config({ path: "./config/config.env" });

// parse application/x-www-form-urlencoded

app.use(bodyParser.urlencoded({ extended: false }));

//Handling Uncought Exception error
process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err.message}`);
  console.log("Sutting down due to uncaught exception.");
  process.exit(1);
});

//connecting with db=> makesure this is below env variable
connectDatabase();
//Setup body parser
app.use(express.json());

//setup api endpoint, we don't need to type /api/v1 every time in Postmen
app.use("/api/v1", jobsRouter);
app.use("/api/v1", authRouter);

// Handle unhandled routes
app.all("*", (req, res, next) => {
  next(new ErrorHandler(`${req.originalUrl} route not found`, 404));
});
//Middleware to handle Errors
app.use(errorMiddlewares);

const server = app.listen(process.env.PORT, () => {
  console.log(
    `server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode. `
  );
});

//Handle Unhandled Promise Rejection

process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to unhandled promise rejection.");
  server.close(() => {
    process.exit(1);
  });
});
