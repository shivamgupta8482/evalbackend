const express = require('express')
const app = express()
const connection = require("./Config/db")
var cors = require('cors')
const jwt =require("jsonwebtoken")
const todosModel=require("./Model/todos.model")
app.use(cors());
app.use(express.json());
const dns = require("dns");
const bcrypt =require("bcrypt")
const {UserModel} = require("./Model/user.model")
app.get('/', (req, res) => {
  res.send('Hello World!')
})




app.post("/signup", async (req, res) => {

   

    const {email, password} = req.body;
    bcrypt.hash(password, 5, async function(err, hashed_password) {
        if(err){
            res.send("Something went wrong, please signup later")
        }
        const new_user = new UserModel({
           
            email : email,
            password : hashed_password
        })
        await new_user.save()
        res.send("Sign up successfull")
    });
})




app.post("/login", async (req, res) => {
    const {email, password} = req.body;
    console.log(email,password)
    const user = await UserModel.findOne({email})
    console.log(user);
    const hashed_password = user.password
    bcrypt.compare(password, hashed_password, function(err, result) {
        if(result){
            const token = jwt.sign({email : email}, 'abcd12345')
            res.send({"msg" : "Login successfull", "token" : token})
        }
        else{
            res.send("Login failed")
        }
    });
    
})


const authentication = (req, res, next) => {
    const token = req.headers?.authorization?.split(" ")[1]
    try{
        var decoded = jwt.verify(token, 'abcd12345');
        req.body.email = decoded.email
        next()
    }
    catch(err){
       res.send("Please login again")
    }
}




app.get("/todos",authentication,async (req,res)=>{
    try{
        const {user_id} = req.body;
        const data =  await todosModel.find({user_id});
  
       res.send({data})
    }catch(err){
        res.send(err);
    }
})

app.post("/todos/create",authentication,async(req,res)=>{
    const {taskname}=req.body;
    const data = new todosModel({
        taskname
    })
    await data.save();
    res.send({"task":taskname});

})

app.delete("/:todoId", async (req, res) => {
    const todoId = Number(req.params.todoId);
    const userId = Number(req.headers.authentication.split(" ")[1]);
    await allNotesModel.deleteOne({ todoId, userId });
    res.send("deletd sucess");
  });
  
  
  app.patch("/:todoId",async(req,res)=>{
  const todoId = Number(req.params.todoId);
  const userId = Number(req.headers.authentication.split(" ")[1]);
  await allNotesModel.updateOne({todoId,userId},{$set:req.body});
  res.send("Updated successfully");
  })



app.listen(8080, async() => {
    try{
        await connection;
        console.log("connected to db");
    }catch(err){
console.log(err);
    }
  
})