const router = require('express').Router();
const dbModel=require('../model/dbModel');
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');
const Joi =  require('@hapi/joi');
const { date } = require('@hapi/joi');
const {registerValidation,loginValidation} = require('../Validation');

require('dotenv').config();
const uuid =require('uuid');




//Login function
async function login(req,res){
    const data=req.body;
    
    //Validation
    const {error} = loginValidation(data);
    if(error){
        res.status(404).send(error.details[0].message);
    }

    //check if email exists
    const user = await dbModel.findOne({email:data.email})
    if(!user){
      return   res.status(404).send('Email or password is wrong');
    }
    //password validation
    const validPass = await bcrypt.compare(data.password,user.password);
    if(!validPass) return res.status(404).send("invalid password");
    

    //create a token
    const token=jwt.sign({
    _id:user._id
    },process.env.TOKEN)
    
    const userData={
        name:user.name,
        id:user._id,
        income:user.Income,
        expense:user.expense
    }
    res.header('auth-token',token).send(userData);
}


//Register Function

async function register(req,res){
    
    const data=req.body;
   


   //Validation
    const {error} = registerValidation(data);
    if(error){
        res.status(404).send(error.details[0].message);
    }
    
    //email exists
    const emailExists = await dbModel.findOne({email:data.email});
    if(emailExists){
        return res.status(400).send({
          newUser:false,
          messsage:"Email already exists"
        });
    }

    //hashng password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword= await bcrypt.hash(data.password,salt);
    
    const user = new dbModel({
        name:data.name,
        password:hashedPassword,
        email:data.email,
        date:Date.now(),
        Income:[],
        expense:[]
 
    })
  

   try{
       const savedUser=await user.save();
       res.send(`User has beed added ${savedUser._id}`);
   }
   catch(err){
       res.status(404).send(err);
   }
}

//Adding Expense

async function AddExpense(req,res){
        
 const data=req.body;
 const expense={
    id:uuid.v4(),
    value:data.expense,
    date:Date.now(),
    type:"Expense",
    category:req.category,
    purpose:req.purpose
 }


 const addExpense = await dbModel.update({"email":data.email},
  { "$push": {"expense": expense },
  },)
 
if(!addExpense) return res.status(400).send({
  OperationSuccessfull:false,
  message:"Error while adding Expense  "
});
res.send({
  OperationSuccessfull:true,
  message:"Expense Addition successful "
})

}

//Adding Income

async function addIncome(req,res){
    const data=req.body;
    const income={
       id:uuid.v4(),
       value:data.income,
       date:Date.now(),
       source:data.source
    }
    
    const addIncome = await dbModel.update({"email":data.email},
     { "$push": {"income": income },
     },)
   if(!addIncome) return res.status(400).send({
    OperationSuccessfull:false,
    message:"Error while adding Income  "
  });
   res.send({
    OperationSuccessfull:true,
    message:"Income Addition successful "
  })
   
}

//Deleting Expense

async function deleteExpense(req,res){
    const data=req.body;
    const deleteExpense =await dbModel.update(
        {
            email:data.email
          },
          {
            "$pull": {
              expense: {
                "id": req.params.id
              }
            }
          }
    );
    if(!deleteExpense) return res.status(404).send({
      OperationSuccessfull:false,
      message:"Some error while deleting Expense "
    });
    res.send({
      OperationSuccessfull:true,
      message:"Expense Deletion successful "
    })
}


//Deleting Income

async function deleteIncome(req,res){
    const data=req.body;
    const deleteIncome =await dbModel.update(
        {
            email:data.email
          },
          {
            "$pull": {

              income: {
                "id": req.params.id
              }
            }
          }
    );
    if(!deleteIncome) return res.status(404).send({
      OperationSuccessfull:false,
      message:"Error while deleting Income "
    });
    res.send({
      OperationSuccessfull:true,
      message:"Income Deletion successful "
    })
}


//Edit expense
async function editExpense(req,res){
    const id = req.params.id;
  const data=req.body;
  const user= await dbModel.findOne({"email":data.email})
  const userDate=user.expense.filter(ele=>ele.id===id)[0].date;

  //checking if the mmodification is afer 12 hours

  let hourDifference=Math.abs(userDate-Date.now())/(60*60*1000)
  if(hourDifference<=12){
  const editExpense = await dbModel.updateOne(
    {email:data.email,"expense.id":id},
    {$set:{"expense.$.value":data.value,"expense.$.date":Date.now()}}
  )
  if(!editExpense) return res.status(404).send("Error  while editing");
  res.send(
    {
      editable:true,
      message:"Edited successfully"
    }
  )

  }
  else{
    res.send({
      editable:false,
      message:"Cannot be edited after 12 hours"
    })
  }
}


//Editing Income

async function editIncome(req,res){
    const id = req.params.id;
    const data=req.body;
    const user= await dbModel.findOne({"email":data.email})
   
    const userDate=user.income.filter(ele=>ele.id===id)[0].date;
    
    
    //checking if the mmodification is afer 12 hours
  
    let hourDifference=Math.abs(userDate-Date.now())/(60*60*1000)
    if(hourDifference<=12){
    const editIncome = await dbModel.updateOne(
      {email:data.email,"income.id":id},
      {$set:{"income.$.value":data.value,"expense.$.date":Date.now()}}
    )
    if(!editIncome) return res.status(404).send("Error  while editing");
    res.send(
      {
        editable:true,
        message:"Edited successfully"
      }
    )
  
    }
    else{
      res.send({
        editable:false,
        message:"Cannot be edited after 12 hours"
      })
    }
}

//Expoting functions
module.exports={
    login,
    register,
    AddExpense,
    addIncome,
    deleteExpense,
    deleteIncome,
    editExpense,
    editIncome
}