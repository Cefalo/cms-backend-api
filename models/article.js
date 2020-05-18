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

articleSchema.pre('save', async function (next) {
    if (!this.isModified('title')){
        return next();
    }
    
    this.url = slugify(this.title, {
        lower: true,      // convert to lower case
        strict: true,     // strip special characters except replacement
    });
    
    //Todo make slug more resiliant to slugs are unique
    // find other stores that have a slug of title, title-1, title-2
    
    const urlRegEx = new RegExp(`^(${this.url})((-[0-9]*$)?)$`, 'i');
    const articleWithUrl = await this.constructor.find({url: urlRegEx}).exec();
    
    if (articleWithUrl.length) {
        this.url = `${this.url}-${articleWithUrl.length + 1}`;
    }
    
    next();
});

var Article=mongoose.model('Article',articleSchema);
module.exports=Article;