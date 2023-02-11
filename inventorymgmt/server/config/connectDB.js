// const mongoose=require('mongoose');
// const connectDB=async() =>{
//     try{
//         await mongoose.connect(process.env.DATABASE_URI,{
//             useUnifiedTopology:true,
//             useNewUrlParser:true,
//         });
//     }catch(err){
//         console.error(err)
//     }

// }
// module.exports=connectDB
require('dotenv').config({ path: 'ENV_FILENAME' });
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const connectDB = async () => {
    console.log(process.env.DATABASE_URI)
    try {
        await mongoose.connect(process.env.DATABASE_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
    } catch (err) {
        console.error(err);
    }
}

module.exports = connectDB