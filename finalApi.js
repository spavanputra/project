const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();
const {PORT, db_USER, db_password} = process.env;
const app = express();
const dbURL = `mongodb+srv://${db_USER}:${db_password}@mine.q1lup.mongodb.net/?retryWrites=true&w=majority&appName=mine`

mongoose.connect(dbURL).then(function(){
    console.log("Connection Success");
}).catch(err => console.log(err));
app.listen(PORT,function(){
    console.log(`server is running at this port ${PORT}`);
})


const userSchemaRues = {
    amount : {
        type : Number,
        required : [true,"kindly pass the name"]
    },
    transactionType : {
        type : String,
        required : [true,"kindly pass the name"]
    },
    userId :{
        type : Number,
        required : [true,"kindly pass the name"]
    },
    status :{
        type : String,
        required : [true,"kindly pass the name"]
    }
}

const userSchema = new mongoose.Schema(userSchemaRues)
const userModel = mongoose.model("UserModel",userSchema);

app.use(express.json());

app.post("/api/transactions",createUserHandler)

async function  createUserHandler(req,res){
    console.log("Incoming request body:", req.body); 
    try{
        const userDetails = req.body
        const user = await userModel.create(userDetails)
        res.status(200).json({
        message : "user created",
        status : "success",
        user
    })
    }catch(err){
        res.status(400).json({
            message : "error",
            status : "failure",
    })
}
}
app.get("/api/transactions",getAllUsers)
async function getAllUsers(req,res){
    try{
        const userDataStore = await userModel.find()
        if(userDataStore.length === 0){
            throw new Error("No Users Found");
        }
        res.status(200).json({
            status:"success",
            message:userDataStore
        })
    }catch(err){
        res.status(404).json({
            status:"failure",
            message:err.message
        })
    }

}
//app.get("/api/transactions/:userId",getUserId)
app.get("/api/transactions/:userId", getUserById);

app.get("/api/transactions/:userId", getUserById);
async function getUserById(req, res) {
    try {
        const userId = req.params.userId;
        const userDetails = await userModel.findOne({ userId });
        if (!userDetails) {
            throw new Error(`User with ID ${userId} not found`);
        }
        res.status(200).json({
            status: "success",
            user: userDetails
        });
    } catch (err) {
        res.status(404).json({
            status: "failure",
            message: err.message
        });
    }
}
app.put("/api/transactions/:userId", updateUserHandler);

async function updateUserHandler(req, res) {
    try {
        const userId = req.params.userId; 
        const updatedData = req.body; 
        const updatedUser  = await userModel.findOneAndUpdate(
            { userId: userId }, 
            updatedData, 
            { new: true, runValidators: true } 
        );

        if (!updatedUser ) {
            return res.status(404).json({
                status: "failure",
                message: `User  with ID ${userId} not found`
            });
        }

        res.status(200).json({
            status: "success",
            message: "User  updated successfully",
            user: updatedUser 
        });
    } catch (err) {
        res.status(400).json({
            status: "failure",
            message: err.message
        });
    }
}
