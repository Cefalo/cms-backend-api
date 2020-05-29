const express = require('express')
const router = express.Router()
const multer = require('multer')

const AuthValidationMiddleware = require('../middlewares/auth.validation.middleware')
const AuthPermissionMiddleware = require('../middlewares/auth.permission.middleware')
const BinariesController = require('../controllers/binaries.controller')

// configure DiscStorage engine
const storage = multer.diskStorage({
  destination: process.env.FS_UPLOAD_IMAGE,
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  },
})

const upload = multer({ storage: storage })

router.get(
  '/images/:id/:filename',
  AuthValidationMiddleware.verifyJwtToken,
  AuthPermissionMiddleware.minimumPermissionLevelRequired(
    process.env.AUTH_PERMISSION_VIEWER
  ),
  BinariesController.retrieveImage
)

router.post(
  '/images/upload',
  upload.single('image'),
  AuthValidationMiddleware.verifyJwtToken,
  AuthPermissionMiddleware.minimumPermissionLevelRequired(
    process.env.AUTH_PERMISSION_EDITOR
  ),
  BinariesController.uploadImage
)

module.exports = router
