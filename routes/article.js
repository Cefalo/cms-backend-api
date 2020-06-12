var debug = require('debug')
var express = require('express')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var slugify = require('slugify')
var auth = require('../middlewares/auth.validation.middleware')

var Article = require('../models/article')
const Revision = require('../models/revision.model')
const Fragment = require('../models/fragment.model')
const Image = require('../models/images.model')
const ExternalResource = require('../models/external.link.model')

var router = express.Router()
router.use(bodyParser.json())

var createUniqueUrl = (title, callBack, counter = 0) => {
  var url = slugify(title, {
    lower: true, // convert to lower case
    strict: true, // strip special characters except replacement
  })

  if (counter > 0) {
    url += '-' + counter
  }

  Article.findOne({ url: url }).then((art) => {
    if (null === art) {
      callBack(url)
    } else {
      createUniqueUrl(title, callBack, counter + 1)
    }
  })
}

router
  .route('/')
  .get((req, res, next) => {
    Article.find({})
      .sort({ updatedAt: -1 })
      .limit(5)
      .populate('author')
      .exec(function (err, articles) {
        if (err) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.json(err)
        } else {
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.json(articles)
        }
      })
  })
  .post(auth.verifyJwtToken, (req, res, next) => {
    createUniqueUrl(req.body.title, (url) => {
      var article = new Article({ title: req.body.title })
      article.url = url
      article.body = req.body.body
      article.author = req.jwt.userId

      article.save((err, art) => {
        if (err) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.json(err)
        } else {
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.json(art)
        }
      })
    })
  })
  .put((req, res, next) => {
    res.statusCode = 403
    res.end('PUT operation not supported on /article')
  })
  .delete((req, res, next) => {
    res.statusCode = 403
    res.end('DELETE operation not supported on /article')
  })

/* with id */
router
  .route('/:articleId')
  .get((req, res, next) => {
    Article.findById(req.params.articleId)
	  .populate('author')
	  .populate('body')
      .then(
        (article) => {
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.json(article)
        },
        (err) => next(err)
      )
      .catch((err) => next(err))
  })
  .post((req, res, next) => {
    res.statusCode = 403
    res.end('POST operation not supported on /article/' + req.params.articleId)
  })
  .put(auth.verifyJwtToken, (req, res, next) => {
    if (mongoose.Types.ObjectId.isValid(req.params.articleId)) {
      Article.findById(req.params.articleId)
        //.populate('author')
        .then(
          (article) => {
            if (null === article) {
              var err = new Error(
                'Article ' + req.params.articleId + ' not found'
              )
              err.status = 404
              return next(err)
            } else {
              //update url as title is changed
              if (article.title !== req.body.title) {
                createUniqueUrl(req.body.title, (url) => {
                  Article.findByIdAndUpdate(
                    req.params.articleId,
                    {
                      $set: {
                        title: req.body.title,
                        url: url,
                        body: req.body.body,
                      },
                    },
                    { new: true }
                  )
                    .then(
                      (upudatedArt) => {
                        res.statusCode = 200
                        res.setHeader('Content-Type', 'application/json')
                        res.json(upudatedArt)
                      },
                      (err) => next(err)
                    )
                    .catch((err) => next(err))
                })
              } else {
                Article.findByIdAndUpdate(
                  req.params.articleId,
                  {
                    $set: req.body,
                  },
                  { new: true }
                )
                  .then(
                    (upudatedArt) => {
                      res.statusCode = 200
                      res.setHeader('Content-Type', 'application/json')
                      res.json(upudatedArt)
                    },
                    (err) => next(err)
                  )
                  .catch((err) => next(err))
              }
            }
          },
          (err) => next(err)
        )
        .catch((err) => next(err))
    } else {
      var err = new Error('Article ' + req.params.articleId + ' not found')
      err.status = 404
      return next(err)
    }
  })
  .delete(auth.verifyJwtToken, (req, res, next) => {
    if (mongoose.Types.ObjectId.isValid(req.params.articleId)) {
      Article.findById(req.params.articleId)
        .then(
          (art) => {
            if (null === art) {
              var err = new Error(
                'Article ' + req.params.articleId + ' not found'
              )
              err.status = 404
              return next(err)
            } else {
              //only creator can delete his article
              if (art.author.id == req.jwt.userId) {
                Article.findByIdAndRemove(req.params.articleId).then((rem) => {
                  res.statusCode = 200
                  res.setHeader('Content-Type', 'application/json')
                  res.json(art)
                })
              } else {
                var err = new Error(
                  'You do not have permission to delete this article!'
                )
                err.status = 403
                return next(err)
              }
            }
          },
          (err) => next(err)
        )
        .catch((err) => next(err))
    } else {
      var err = new Error('Article ' + req.params.articleId + ' not found')
      err.status = 404
      return next(err)
    }
  })

/** revision for a single article */
router
  .route('/:articleId/revision/')
  .post(async (req, res, next) => {
    let baseRevision = req.body.baseRevision

		let frags = req.body.frags

		try{
			let revisionObj = {
				'revision': baseRevision,
				'frags':[]
			}
			frags.array.forEach(element => {
				if(element.type === 'delete'){
					let fragment = await Fragment.findOne({name:element.name})

					await Article.update(
						req.params.articleId,
						{
							$pull:{ body:fragment._id }
						}
					)

					revisionObj.frags.push({'operationType': element.type, 'fragment': fragment})
					/** if want to remove whole fragment */
					/**
					let fragment = await Fragment.findOneAndRemove({name:element.name})
					await Image.remove({ _id: { $in: fragment.image } })
					await ExternalResource.remove({ _id: { $in: fragment.iframe } })
					await ExternalResource.remove({ _id: { $in: fragment.externalResource } })
					 */

				}else{
					let fragment = {
						name: element.name,
						text: element.text,
						tag: element.tag,
						markups: element.markups
					}
					if(element.imageId){
						fragment.image = element.imageId
					}

					if(element.iframeId){
						fragment.iframe = element.iframeId
					}

					if(element.externalResourceId){
						fragment.externalResource = element.externalResourceId
					}

					let updatedFrag = await Fragment.update(
										{name: element.name},
										fragment,
										{upsert: true},
										{new: true}
									)

					await Article.update(
						req.params.articleId,
						{
							$push: {
								body: {
									$each: [updatedFrag],
									$position: element.lineNumber-1
								}
							}
						}
					)

					revisionObj.frags.push({'operationType': element.type, 'fragment': updatedFrag})


				}

			});

			await Revision.update(
				{articleId: req.params.articleId},
				{
					$set:{currentRevision: baseRevision},
					$push:{revisions: revisionObj}
				},
				{upsert: true}
			)

		}catch(err){
			next(err)
		}
  })

module.exports = router
