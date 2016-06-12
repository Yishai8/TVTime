var mongoose = require ('mongoose');
var schema = mongoose.Schema;
var userSchema = new schema({id:{type:Number ,unique:true},ep_id:Number});
var parentSchema=new schema (
    {id:{type:Number ,unique:true},
               name:String,
               email:{type:String,unique:true},
    shows: [userSchema]
},
    {collection:'users'});

module.exports=parentSchema;