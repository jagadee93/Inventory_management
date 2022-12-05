const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const rationSchema=new Schema({
    PacketID:{
        type: String,
        unique: true,
        uppercase: true,
        required: true
    },
    PacketType:{
        type: String,
        required: true
    },
    PacketContent:{
        type: String,
        default:"-",
        required:false
    },
    calories: {
        type:Number,
        required:false,
    },
    ExpiryDate:{
        type:String,
        required:false,
    },
    Quantity:{
        type:Number,
        required:false,
    }
},{
    timestamps:true
}
);

module.exports = mongoose.model('Ration', rationSchema);