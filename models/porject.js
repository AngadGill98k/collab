const mongoose=require('mongoose')
const projectschema=new mongoose.Schema({
    name:String,
    users:[String],
    content:String
})
const Project=mongoose.model('project',projectschema)
module.exports=Project