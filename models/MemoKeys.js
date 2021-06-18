var mongoose = require('mongoose')
var Schema = mongoose.Schema

const MemoKeys = new Schema ({
    id : [],
    firstname : [],
    lastname : [],
    email : [],
    gender : [],
})
module.exports=mongoose.model("MemoKeys", MemoKeys)