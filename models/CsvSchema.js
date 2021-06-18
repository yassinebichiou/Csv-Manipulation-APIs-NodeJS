var mongoose = require('mongoose')
var Schema = mongoose.Schema

const csvSchema = new Schema ({
id : {type : String, required : true },
 firstname : {type : String, required : true},
 lastname : {type : String, required : true},
 email : {type : String, required : true},
 gender : {type : String, required : true},
 Ip_Adress : {type: String}

})
module.exports=mongoose.model("csvSchema", csvSchema)