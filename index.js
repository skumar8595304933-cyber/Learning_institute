const express=require('express')
const app=express()
require('dotenv').config()
const port=process.env.PORT

app.use(express.json());

const dbcon=require('./config/database.js')
dbcon();


app.get('/',(req,res)=>{
    res.send("hello world")
})

app.listen(port,function(){
    console.log("code running")
});
