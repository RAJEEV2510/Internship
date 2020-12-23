const mongoose =require('mongoose')
mongoose.connect('mongodb+srv://mongo_db_user:RAJEEV@cluster0-4o2hk.mongodb.net/intern?retryWrites=true&w=majority',{useNewUrlParser:true,useCreateIndex:true, useUnifiedTopology: true })
var con =mongoose.connection;
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{

        type:String,
        require:true,
    },
    password:{
        type:String,
        require:true
    },
    
  })
const userModel=mongoose.model('user',userSchema);
module.exports=userModel;