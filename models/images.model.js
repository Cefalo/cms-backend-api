const mongoose = require('../services/db.service').mongoose

const imageSchema = new mongoose.Schema({
  _id: { type: String },
  fileName: { type: String, required: true, trim: true },
  caption: { type: String },
  author: { type: String, trim: true },
  credits: [String],
  imageType: { type: String },
  copyright: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, default: 'published' },
})

const Images = mongoose.model('Image', imageSchema)

exports.saveImage = (imageData) => {
  const image = new Images(imageData)
  return image.save()
}

exports.findById = (id) => {
  Images.findById(id).then((result) => {
    return result
  })
}

exports.findByAuthor = (email) => {
  return Images.find({ author: email })
}
