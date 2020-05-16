var debug = require('debug')
var express = require('express');
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
            .sort({'updatedAt':-1})
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

module.exports = router;