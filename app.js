//jshint esversion:6
require("dotenv").config();  //high security level 2 we just need to require it and then call config on it and we dont need to over again...
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();
//console.log(process.env.API_KEY); its for the testing pourpose that works or not and we will ignore this file using .igignore to ignore this for security while uploading it to the real server...

app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));

//mongoose Connection to the database
const connectionString = "mongodb://127.0.0.1:27017/userDB"; //userDB database Created
mongoose.connect(connectionString,{useNewUrlParser:true,useUnifiedTopology: true});

const db = mongoose.connection;
db.on("error",function(err){
    console.log(err);
});

db.once("open",function(){
    console.log("database connected succesfully");
});

const userSchema = new mongoose.Schema({
    email:String,
    password:String
});

//mongoose encrption
//Secret String Instead of Two Keys

//const secret = "mysecretFilethatnoOneKnows"; //we added it in the .env file for security reson we can access it like process.env.secret thats all  //secret string instead of two keys

userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});

//here we all only encrypting the password we are adding plugins to the userSchema
//in above that will plugin automatically and we dont wants to change the below code because the mongoose is very intelligent and can do it without changing

const User = mongoose.model("User",userSchema); // //user is the new collection

app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});

//post requests for the register and login
//level 1 security

app.post("/register",function(req,res){
    const newUser = new User({
        email:req.body.username,
        password:req.body.password
    });
//saving the data in to the mongodb database
    newUser.save(function(err){
        if(err){
            console.log(err);
        }else{
            res.render("secrets");
        }
    });
});

app.post("/login",function(req,res){
//first we need to get what user types and save it

    const username = req.body.username;
    const password = req.body.password;

//after that we wants to find the data entered by the user exist in our database or not

    User.findOne({email:username},function(err,found){
        if(err){
            console.log(err);
        }else{
            if(password === found.password){
                res.render("secrets");
            }
        }
    });  ///or we can do as angela done the code is below

/*pp.post("/login",function(req,res){
//first we need to get what user types and save it

    const username = req.body.username;
    const password = req.body.password;

    //after that we wants to find the data entered by the user exist in our database or not

    User.findOne({email:username},function(err,found){
        if(err){
            console.log(err);
        }else{
            if(found){
                if(password === found.password){
                    res.render("secrets");
                }
            }
        }
    }); */

//Level 2 security

/*A .env file is a plain text file used to store environment variables for a software application. These variables can include things like database credentials, API keys, or other sensitive information that should not be hard-coded into the application's source code. The .env file is typically located in the root directory of the application and is not committed to version control, so that this sensitive information is kept private. */

//so that we are install that npm package and we will require it in our app


})
app.listen(3000,function(){
    console.log("the server is listening on port 3000");
});