var mongoose = require ('mongoose');
var schema = mongoose.Schema;
var showSchema = new schema({id:{type:Number ,unique:true},
               name:String, viewers:Number},
    {collection:'shows'});

module.exports=showSchema;