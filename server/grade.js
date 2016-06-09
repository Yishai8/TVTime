var mongoose = require ('mongoose');
var schema = mongoose.Schema;
var childSchema = new schema({id:{type:Number ,unique:true},
               firstName:String,
               lastName:String,
               GPA:Number});
var parentSchema=new schema ({
    year:Number,
    students: [childSchema]
},
    {collection:'grades'});

module.exports=parentSchema;