require("dotenv").config();
const express = require("express")
const ejs = require("ejs")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const encrypt = require("mongoose-encryption")

const app = express()
app.use(bodyParser.urlencoded({extended:true}))
app.set("view engine",'ejs')



mongoose.connect("mongodb://localhost:27017/userDB")
const userSchema = new mongoose.Schema({
  email : String,
  password: String
})

userSchema.plugin(encrypt,{secret:process.env.SECRETT,encryptedFields:["password"]})
const User = new mongoose.model("User",userSchema)




app.get('/',function(req,res){
  res.render("home")
});
app.get('/register',function(req,res){
  res.render("register")
});
app.get('/login',function(req,res){
  res.render("login")
});





app.post('/register',function(req,res){
  const tmpUser = new User({
    email: req.body.username,
    password: req.body.password
  })
  tmpUser.save(function(err){
    if(!err){
      res.render("secrets")
    }
    else{
      res.send(err)
    }
  })
})
app.post('/login',function(req,res){
  const tmpId = req.body.username
  User.findOne({email:tmpId},function(err,ans){
    if(err){
      res.send(err)
    }
    else{
      if(ans){
        if(req.body.password==ans.password){
          res.render("secrets")
        }
        else{
          res.send("Password is wrong , try again.")
        }
      }
      else{
        res.send("User not registered ! , Please register first.")
      }
    }
  })
})






app.listen(3000,function(){
  console.log("Server is up on prt 3000!")
});
