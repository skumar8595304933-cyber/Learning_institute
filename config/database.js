const mongoose=require('mongoose');
require('dotenv').config();


const dbcon= async ()=>{
    try{
        const con= await mongoose.connect(process.env.DATA_URL);
        console.log("db connected successfully")
    }
    catch(err){
        console.log("db not connected",message.err);

    }
}

module.exports=dbcon

