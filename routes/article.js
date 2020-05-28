var debug = require('debug')
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var auth = require('../middlewares/auth.validation.middleware');

var Article = require('../models/article');

var router = express.Router();
router.use(bodyParser.json());


router.route('/')
	.get((req, res, next) => {
		Article.find({})
			.sort({ 'updatedAt': -1 })
			.limit(5)
			.populate('author')
			.exec(function (err, articles) {
				if (err) {
					var err = new Error(err);
					err.status = 500;
					return next(err);
				}
				else {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(articles);
				}
			});
	})
	.post(auth.verifyJwtToken, (req, res, next) => {

		Article.create({
			title: req.body.title,
			body: req.body.body,
			author: req.jwt.userId
		})
		.then((article) => {
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.json(article);
		}, (err) => next(err))
		.catch((err) => next(err));

	})
	.put((req, res, next) => {
		var err = new Error('PUT operation not supported on /article');
		err.status = 403;
		return next(err);
	})
	.delete((req, res, next) => {
		var err = new Error('DELETE operation not supported on /article');
		err.status = 403;
		return next(err);
	});


/* with id */
router.route('/:articleId')
	.get((req, res, next) => {
		Article.findById(req.params.articleId)
			.populate('author')
			.then((article) => {
				if (null === article) {
					var err = new Error('Article ' + req.params.articleId + ' not found');
					err.status = 404;
					return next(err);
				}
				else {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(article);
				}
			}, (err) => next(err))
			.catch((err) => next(err));
	})
	.post((req, res, next) => {
		var err = new Error('POST operation not supported on /article/' + req.params.articleId);
		err.status = 403;
		return next(err);
	})
	.put(auth.verifyJwtToken, (req, res, next) => {

		Article.findByIdAndUpdate(req.params.articleId, {
			$set: req.body
		}, { new: true })
			.then((upudatedArt) => {
				if (null === upudatedArt) {
					var err = new Error('Article ' + req.params.articleId + ' not found');
					err.status = 404;
					return next(err);
				}
				else {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(upudatedArt);
				}

			}, (err) => next(err))
			.catch((err) => next(err));
	})
	.delete(auth.verifyJwtToken, (req, res, next) => {
		if (mongoose.Types.ObjectId.isValid(req.params.articleId)) {
			Article.findById(req.params.articleId)
				.then((art) => {
					if (null === art) {
						var err = new Error('Article ' + req.params.articleId + ' not found');
						err.status = 404;
						return next(err);
					}
					else {
						//only creator can delete his article
						if (art.author == req.jwt.userId) {
							Article.findByIdAndRemove(req.params.articleId)
								.then(rem => {
									res.statusCode = 200;
									res.setHeader('Content-Type', 'application/json');
									res.json(art);
								});
						}
						else {
							var err = new Error('You do not have permission to delete this article!');
							err.status = 403;
							return next(err);
						}

					}

				}, (err) => next(err))
				.catch((err) => next(err));
		}
		else {
			var err = new Error('Article ' + req.params.articleId + ' not found');
			err.status = 404;
			return next(err);
		}
	});

module.exports = router;
