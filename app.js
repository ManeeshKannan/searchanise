const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const globalerrorController = require("./Controller/errorController");
const ProductRouter = require("./Routes/ProductRouter");
const config = require("./config");
const AppError = require("./utils/appError");
const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());



//security not to allow api calls from postman or browser
var whitelist = ["http://127.0.0.1:3000"];
var corsOptions = {
    origin: function(origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            //if you want to allow from postman and browser // || !origin) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
};

app.use(cors(corsOptions));

//Routes

app.use("/api/dev/v1", ProductRouter);

app.use("*", (req, res, next) => {
    next(new AppError("Please Check the URL", 404));
});

process.on("uncaughtException", (err) => {
    console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
    console.log(err.name, err.message);
    process.exit(1);
});
const port = config.port || 8000;

const server = app.listen(port, () => {
    console.log(`App is running in ${port}`);
});

process.on("unhandledRejection", (err) => {
    console.log("UNHANDLED REJECTION! 💥 Shutting down...");
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

app.use(globalerrorController);