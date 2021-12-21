const express= require('express');
const mongoose = require('mongoose');
require('dotenv').config()
const  authRoute = require('./routes/Auth');
var cors = require('cors')
//MongoDb url

const MONGO_URL=`mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@cluster0.7guna.mongodb.net/MoneyExpense?retryWrites=true&w=majority`;

mongoose.connect(MONGO_URL,(err)=>{
    if(err){
        console.log(err)
    }
    else{
        console.log('db connected successfully')
    }
});

var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

const app=express();
app.use(cors({origin: 'http://localhost:3000'}));;

//Middle Ware
app.use(express.json());


//routes middlwware
app.use('/user/',cors(corsOptions),authRoute);

app.listen(process.env.PORT,()=>console.log('Server up and runnning'));
