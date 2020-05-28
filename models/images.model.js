const mongoose = require('../services/db.service').mongoose;

const imageSchema = new mongoose.Schema({
    fileName: {type: String, required: true, trim: true},
    caption: {type: String},
    createdAt: {type: Date, default: Date.now},
});