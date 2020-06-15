const mongoose = require('mongoose')
const Schema = mongoose.Schema

const fragmentSchema = new Schema({
	articleid: { type: String, require: true },
	tag: { type: String, require: true }, //'div/p/h3/h4/blockquote/figure/iframe'
	name: { type: String, require: true }, //unique for an article,
	text: { type: String, index: true }, //'textContent', (for type image it is caption)
	markups: [new Schema(
		{
			tag: { type: String }, //'strong/em/a', (1:Bold, 2:italic, 3:anchor)
			startAt: { type: Number }, //start Tag Position,
			endAt: { type: Number }, //end Tag Position,
			href: { type: String }, // for anchore urlString
		},
		{_id: false}
		)
	],
	//for type figure/image
	image: { type: Schema.Types.ObjectId, ref: 'Image' },
	//for type 7 iframe
	iframe: { type: Schema.Types.ObjectId, ref: 'ExternalLink' },
	//for embed any link
	externalResource: { type: Schema.Types.ObjectId, ref: 'ExternalLink' },
})

module.exports = mongoose.model('Fragment', fragmentSchema)
