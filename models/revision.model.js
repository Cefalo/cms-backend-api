var mongoose=require('mongoose');
const Schema = mongoose.Schema;
const revisionSchema = new Schema({
	articleId:{type: String, required: true, unique: true},
	currentRevision: {type: Number, required: true},
	revisions:[new Schema({
		revision: {type: Number},
		frags:[new Schema({
			operationType:{type:String},
			fragment: {type: Schema.Types.ObjectId, ref: 'Fragment'}
		},{_id: false})]
	}, {_id: false})]
});

module.exports = mongoose.model('Revision', revisionSchema);
