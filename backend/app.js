const express = require("express");
const errorMiddleware = require("./middlewares/error");
const cookieParser = require("cookie-parser");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({path:path.join(__dirname,"config/config.env")});

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use('/upload', express.static(path.join(__dirname, 'upload')));

const products = require("./routes/product");
const auth = require("./routes/auth");
const order = require("./routes/order");
const payment = require("./routes/payment");

app.use('/api/v1/', products);
app.use('/api/v1/', auth);
app.use('/api/v1/', order);
app.use('/api/v1/', payment);

//To connect frontend using build...
if(process.env.NODE_ENV == 'production') {  //It will create a middleware and pass it into app.use...
    app.use(express.static(path.join(__dirname, '../frontend/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'));  //The all api handle requests loads from index.html...eg(/api/v1/...) also retturn all the javascript and css codes from frontend using index.html...
    })
}

app.use(errorMiddleware);

module.exports = app;