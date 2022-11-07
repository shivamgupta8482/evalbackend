





const mongoose = require("mongoose");
const todosSchema =new mongoose.Schema({
    user_id:String,
    taskname : String,
    status :  { type: String, default: 'pending' },
    tag :  { type: String, default: 'personal' }

  

})

const todosModel = mongoose.model("todoss",todosSchema);
module.exports=todosModel;
