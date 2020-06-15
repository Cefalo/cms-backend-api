var mongoose = require('mongoose')
const Schema = mongoose.Schema
const externalLinkSchema = new Schema({
	title: { type: String },
	source: { type: String },
})

module.exports = mongoose.model('ExternalLink', externalLinkSchema)
