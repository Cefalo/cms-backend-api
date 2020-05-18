var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var slugify = require('slugify');

var articleSchema = new Schema({
	title: {
		type: String,
		require: true
	},
	url: {
		type: String,
		require: true
	},
	body: [String],
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
