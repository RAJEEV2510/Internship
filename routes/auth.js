const express=require('express');
const app=express();
const router=express.Router();
const bodyParser=require('body-parser');
const userModel=require('../models/user')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
var validator = require("email-validator");
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//create protection for routes
const protection=(req,res,next)=>{

    const {authorization}=req.headers;

    if(!authorization)
    {
        res.status(401).json({error:"please login in our website "})
    }
    const token=authorization.split(" ");
    console.log(token);
    jwt.verify(token[1],'secret',(err,payload)=>{
    
        console.log(token);
        if(err)
        {
            res.status(401).json({err:'error'})
    
        }
        else
        {
           
            const {_id}=payload;
            
               userModel.findById(_id).then((data)=>{
                res.status(200).json({message:"you successfully sign in",data:data});
                next()
            })
        }
    
    });
    }

    //hello world route
router.get('/',(req,res)=>{

res.send("HELLO SERVER");

})

//profile routes
router.get('/profile',protection,(req,res)=>{

})


//sign up route for user 
router.post('/signup',(req,res)=>{

      const {name,email,password}=req.body;
      console.log(req.body)
        if(!validator.validate(email))
            return res.status(422).json({error:"email error"});

      if(!email || !name || !password)
      {
        return   res.status(422).json({error:"please add all the feed"})
      }
      else{
      userModel.findOne({email:email}).then((savedUser)=>{
          if(savedUser)
          {
              return res.status(422).json({error:"user already exist"})
          }
          bcrypt.hash(password,10,(err,hash)=>{
          const user =new userModel({
              name:name,
              password:hash,
              email:email,
              
          })
          user.save().then((user)=>{

                res.status(200).json({user:"saved successfuly"})
          })
        
        })
      })
    }
})

//sign in router for user

router.post('/signin',(req,res,next)=>{

    const {email,password}=req.body;
    if(!validator.validate(email))
    return res.status(422).json({error:"email error"});
    if(!email || !password)
    {
      return   res.status(422).json({error:"please add all the feed"})
    }
    else
    {
        userModel.findOne({email:email}).then((saveUser)=>{
                
            if(!saveUser){
                return   res.status(422).json({error:"user does not exist"})
             
            }
            else
            {
                bcrypt.compare(password,saveUser.password,(err,result)=>{
                    if(result)
                    {
                        const token=jwt.sign({_id:saveUser._id},"secret");
                        const {_id,name,email}=saveUser;
                        req.session.userid=_id;
                        req.session.token=token;
                       
                            
                        
                    res.status(200).json({message:"message confirm",token:token,user:{_id,name,email}})
                    }
                    else
                    {
                    
                        res.send('not valid')
                    }
                })
              
            }
        })
    }
})

//changepassword api code
router.post('/changepassword',(req,res)=>{

    const {password,email}=req.body;
    if(!password || !email )
        return res.status(422).json({error:"validation error"});

    userModel.findOne({email:email}).then((savedUser)=>{
        if(!savedUser)
        {
            return res.status(422).json({error:" no user exist"})
        }
        bcrypt.hash(password,10,(err,hash)=>{
            
          console.log(savedUser)
            userModel.findByIdAndUpdate(savedUser._id,{password:password}).then((err,data)=>{

                res.json({data,});
            });


        })
      
      })
    })
        
        
module.exports=router


