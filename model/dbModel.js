
const mongoose=require('mongoose');
const schema = mongoose.Schema({
    name:{
        type:String,
        min:8,
        max:255,
        required:true
    },
    password:{
        type:String,
        min:8,
       max:1024,
        required:true
    },
    email:{
        type:String,
        required:true
        
    },
    income:{
        type:Array,
        
        
    },
    expense:{
        type:Array,
        
        
    },
    date:{
        type:Date,
        required:true
    }
});

module.exports=mongoose.model('data',schema);

