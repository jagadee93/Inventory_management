const { json } = require("body-parser");
const Ration=require("../model/RationModel")

const viewInventory=async(req,res)=>{

    const inventory=await Ration.find().exec();
    if(!inventory) return res.status(204).json({"message":"no ration found"});
    res.json(inventory);
}

    
const addRation=async(req,res)=>{
    console.log(req.body);
    const {PacketID,PacketType,PacketContent,calories,ExpiryDate,Quantity}=req?.body;
    const duplicate=await Ration.findOne({"PacketID":PacketID}).exec();
    console.log(duplicate,"duplicate packet");
    if (duplicate) return res.status(409).json({"message":"packet id must be unique"}); //conflict 
    console.log(PacketID,PacketType,PacketContent,calories,ExpiryDate,Quantity)
    if(!PacketType || !PacketID) return res.status(400).json({"message":"Packet Type and Packet ID  is required"});
    try{
        const result=await Ration.create({
            "PacketID":PacketID,
            "PacketType":PacketType,
            "PacketContent":PacketContent,
            "calories":calories,
            "ExpiryDate":ExpiryDate,
            "Quantity":Quantity
        });
        console.log(result,"result");
         return res.status(201).json({"success": `new packet ${PacketID} is added to inventory`});
    }catch(err){
         return res.status(500).json({"message":err.message});
    }
}   


const DeleteRation=async(req,res) =>{
    if(!req.params.id) return res.status(400).json({"message": "Packet ID is required"});
    const item=await Ration.findOne({PacketID:req.params.id});
    if(!item) return res.status(204).json({"message": "item not found"});
    const result= await item.deleteOne();
    console.log(result);
    return res.status(200).json({"message": `item with id ${result.PacketID} successfully deleted `});
}

module.exports = {
    viewInventory,
    DeleteRation,
    addRation,
}

