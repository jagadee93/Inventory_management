const express=require('express');
const Router=express.Router();
const DataHandler=require("../../../controller/dataHandler")
Router.route("/")
    .get(DataHandler.sendData)
module.exports=Router