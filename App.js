const express= require('express');
const mongoose = require('mongoose');
require('dotenv').config()
const  authRoute = require('./routes/Auth');

//MongoDb url

const MONGO_URL=`mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@cluster0.7guna.mongodb.net/MoneyExpense?retryWrites=true&w=majority`;

mongoose.connect(MONGO_URL,(err)=>{
    if(err){
        console.log(err)
    }
    else{
        console.log('db connected')
    }
});



const app=express();


//Middle Ware
app.use(express.json());


//routes middlwware
app.use('/user/',authRoute);

app.listen(3000,()=>console.log('Server up and runnning'));
