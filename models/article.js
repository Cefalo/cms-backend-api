var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var slugify = require('slugify');

const optsVirtual = { toJSON: { virtuals: true } };

var propSchema = new Schema({
	name: {
		type: String,
		require: true,
		trim: true
	},
	value: {
		type: String,
		require: true,
		trim: true
	}
});

var bodySchema = new Schema({
	tag: {
		type: String,
		trim: true,
		lowercase: true
	},
	innerHTML: {
		type: String
	},
	props: [propSchema]
},optsVirtual);

//obj to html generator
function getHtml(obj){
	var str;
	if(obj.tag){
		str='<'+obj.tag;
	};
	//add props
	str+=obj.props.map(p=>' '+p.name+'="'+p.value+'"').join('');

	if(!obj.innerHTML && !obj.children.length){
		str+='/>';
	}
	else{
		str+='>';
		if(obj.children.length){
			obj.children.forEach(ele=>{
				str+=getHtml(ele);
			});
		}
		else{
			str+=obj.innerHTML;
		}
		str+='</'+obj.tag+'>';
	}
	return str;
}

bodySchema.virtual('html').get(function() {
	return getHtml(this);
});

//recursive elements
bodySchema.add({
	children:[bodySchema]
});


// main schema
var articleSchema = new Schema({
	title: {
		type: String,
		require: true,
		trim: true
	},
	url: {
		type: String,
		require: true
	},
	body: [bodySchema],
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	}
}, {
	timestamps: true
});

articleSchema.pre('save', async function (next) {
	if (!this.isModified('title')) {
		return next();
	}

	this.url = slugify(this.title, {
		lower: true,
		strict: true,
	});

	//Todo make slug more resiliant to slugs are unique
	// find other stores that have a slug of title, title-1, title-2

	const urlRegEx = new RegExp(`^(${this.url})((-[0-9]*$)?)$`, 'i');
	const storesWithUrl = await this.constructor.find({ url: urlRegEx }).exec();

	if (storesWithUrl.length) {
		this.url = `${this.url}-${storesWithUrl.length}`;
	}

	next();
});

var Article = mongoose.model('Article', articleSchema);

module.exports = Article;
