require('dotenv').config();
const express=require('express');
const app = express()
const cors= require("cors");
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const credentials = require('./middleware/credentials');
const mongoose = require('mongoose');
const PORT= process.env.PORT || 3500;
const connectDB= require("./config/DataBaseConn");
//connect to data base 
connectDB();
//custom middleware logger 
app.use(logger);

//handle options credentials check before cors !
app.use(credentials);

//cross origin resource sharing options
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());



//routes
app.use("/api/v1/inventory",require("./routes/api/v1/Ration"))




app.all('*', (req, res) => {
    res.status(404);
     if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});
//public routes 




app.use(errorHandler);
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});