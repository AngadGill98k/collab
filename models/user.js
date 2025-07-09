const mongoose=require('mongoose')

const userschema=new mongoose.Schema({
    name:String,
    mail:String,
    pass:String,
    project:[String],
    request:[String],
    friend:[String]
})
const User=mongoose.model('User',userschema)
module.exports=User