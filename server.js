const express=require('express')
const app=express()
const session=require('express-session')
const cors=require('cors')
app.use(cors())
const bodyParser=require('body-parser')
var page=require('./routes/auth')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge:10000*60*24}
  }))

app.use(bodyParser.json())
app.use('/',page);



app.listen(process.env.PORT || 4000,()=>{
    console.log("SERVER IS RUNNING AT 4000")
})

