require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/connectDB');
const errorHandler = require("./middleware/errorHandler")
const PORT = process.env.PORT || 3500
const app = express();
const cookieParser = require('cookie-parser');
const { logger } = require("./middleware/logEvents")


connectDB();
//custom logger middleware
app.use(logger);
//middleware 
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/api/v1/users", require("./Routes/api/v1/userRoutes"));
app.use(errorHandler)



mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});