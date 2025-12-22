const mongoose = require('mongoose');

mongoose.connect(`mongodb://127.0.0.1.27017/datarefrencing`);

const postSchema = mongoose.Schema({
    postdata : String,
    user : String,
    date :{
        type : Date,
        default : Date.now()
    }
})

module.exports = mongoose.model('post',postSchema);