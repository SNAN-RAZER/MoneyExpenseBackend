const router  = require('express').Router();
const  verify = require('../routes/ValidationOfToken');
var cors= require('cors')
//Importing Controller
const controller = require('../Controller/UserController');

//cors


//Regiter
router.post('/register', controller.register);

//Login
router.post('/login',controller.login);

//Adding Expense
router.put('/addExpense/' ,verify, controller.AddExpense);



 //Add income 
 router.put('/addIncome/' ,verify,controller.addIncome );


 //Delete Expense

 router.delete('/deleteExpense/:id',verify,controller.deleteExpense);

 //Delete Income

 router.delete('/deleteIncome/:id',verify,controller.deleteIncome);


 //edit Expense
router.put('/editExpense/:id',verify,controller.editExpense);
 
//edit income 
router.put('/editIncome/:id',verify,controller.editIncome);
module.exports=router;