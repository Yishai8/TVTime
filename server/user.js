var mongoose = require ('mongoose');
var schema = mongoose.Schema;
var userSchema = new schema({id:{type:Number ,unique:true},
               :Number});
var parentSchema=new schema (
    {id:{type:Number ,unique:true},
               Name:String,
               email:{type:String,unique:true},
    year:Number,
    shows: [childSchema]
},
    {collection:'users'});

module.exports=parentSchema;