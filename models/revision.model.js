var mongoose=require('mongoose');
const Schema = mongoose.Schema;
const revisionSchema = new Schema({
	articleId:{type: String, required: true, unique: true},
	currentRevision: {type: Number, required: true},
	revisions:[{
		revision: {type: Number},
		frags:[{type: Schema.Types.ObjectId, ref: 'Fragment'}],
		action: {type: String, enum:['add', 'delete'], default: 'add'}
	}]
});

const Revision = mongoose.model('Revision', revisionSchema);
