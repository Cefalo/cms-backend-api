const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const BinariesController = require('../controllers/binaries.controller');

// configure DiscStorage engine
const storage = multer.diskStorage({
    destination: path.join(__dirname + process.env.FS_UPLOAD_IMAGE),
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({storage: storage});

router.post('/images/upload', upload.single('image'), BinariesController.uploadImage);

module.exports = router;
