const express = require('express');
const Router=express.Router();
const RationController=require("../../../controllers/RationController");
Router
    .get("/",RationController.viewInventory)
    .post("/",RationController.addRation)
    .delete("/:id",RationController.DeleteRation)
module.exports = Router