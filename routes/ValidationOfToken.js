const jwt = require('jsonwebtoken');
require('dotenv').config();



//Exporting function
module.exports=function (req,res,next){
    const token = req.header('auth-token');
    if(!token) return res.status(404).send("Access denied");

    try{
        const verfied = jwt.verify(token,process.env.TOKEN);
        req.user=verfied;
        next();
    }
    catch(err){
            res.status(400).send({
                error:true,
                message:"invalid token"
            })
    }
}