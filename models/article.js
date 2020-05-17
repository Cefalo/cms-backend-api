var mongoose=require('mongoose');
var Schema=mongoose.Schema;


var articleSchema = new Schema({
    title:{
        type:String,
        require:true
    },
    url:{
        type:String,
        require:true
    },
    body:[String],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, {
    timestamps: true
});

var Article=mongoose.model('Article',articleSchema);
module.exports=Article;