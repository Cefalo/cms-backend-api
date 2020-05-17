var debug = require('debug')
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var slugify = require('slugify')


var Article = require('../models/article');

var router = express.Router();
router.use(bodyParser.json());

var createUniqueUrl = (title, callBack, counter = 0) => {
    var url = slugify(title, {
        lower: true,      // convert to lower case
        strict: true,     // strip special characters except replacement
    });

    if (counter > 0) {
        url += '-' + counter;
    }

    Article.findOne({ url: url })
        .then((art) => {
            if (null === art) {
                callBack(url);
            }
            else {
                createUniqueUrl(title, callBack, counter + 1);
            }
        })
}


router.route('/')
    .get((req, res, next) => {
        Article.find({})
            .sort({ 'updatedAt': -1 })
            .limit(5)
            .exec(function (err, articles) {
                if (err) {
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(err);
                }
                else {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(articles);
                }
            });
    })
    .post((req, res, next) => {
        debug('inside article create');
        createUniqueUrl(req.body.title, (url) => {
            var article = new Article({ title: req.body.title });
            article.url = url;
            article.body = req.body.body;

            article.save((err, art) => {
                if (err) {
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(err);
                }
                else {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(art);
                }
            })
        });
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /article');
    })
    .delete((req, res, next) => {
        res.statusCode = 403;
        res.end('DELETE operation not supported on /article');
    });


/* with id */
router.route('/:articleId')
    .get((req, res, next) => {
        Article.findById(req.params.articleId)
            //.populate('author')
            .then((article) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(article);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /article/' + req.params.articleId);
    })
    .put((req, res, next) => {

        if (mongoose.Types.ObjectId.isValid(req.params.articleId)) {

            Article.findById(req.params.articleId)
                //.populate('author')
                .then((article) => {

                    if (null === article) {
                        var err = new Error('Article ' + req.params.articleId + ' not found');
                        err.status = 404;
                        return next(err);
                    }
                    else {
                        //update url as title is changed
                        if (article.title !== req.body.title) {
                            createUniqueUrl(req.body.title, (url) => {
                                Article.findByIdAndUpdate(req.params.articleId, {
                                    $set: { "title": req.body.title, "url": url, "body": req.body.body }
                                }, { new: true })
                                    .then((upudatedArt) => {
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json(upudatedArt);
                                    }, (err) => next(err))
                                    .catch((err) => next(err));
                            });
                        }
                        else {
                            Article.findByIdAndUpdate(req.params.articleId, {
                                $set: req.body
                            }, { new: true })
                                .then((upudatedArt) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(upudatedArt);
                                }, (err) => next(err))
                                .catch((err) => next(err));
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
    })
    .delete((req, res, next) => {
        if (mongoose.Types.ObjectId.isValid(req.params.articleId)) {
            Article.findByIdAndRemove(req.params.articleId)
                .then((resp) => {
                    if(null===resp){
                        var err = new Error('Article ' + req.params.articleId + ' not found');
                        err.status = 404;
                        return next(err);
                    }
                    else{
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(resp);
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