const mongoose = require('../services/db.service').mongoose;

const imageSchema = new mongoose.Schema({
    imageId: {type: String, required: true, trim: true},
    fileName: {type: String, required: true, trim: true},
    storage: {type: String, required: true, trim: true},
    caption: {type: String},
    createdAt: {type: Date, default: Date.now},
});