const fs = require('fs');
const AWS = require('aws-sdk');
const mime = require('mime-types');
const {v4: uuidv4} = require('uuid');

const ImageModel = require('../models/images.model');

AWS.config.update({
    accessKeyId: process.env.IAM_ACCESS_KEY,
    secretAccessKey: process.env.IAM_SECRET_KEY,
    //region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

exports.uploadImage = (req, res) => {
    let fileInfo = {
        source: req.file.path,
        key: `${uuidv4()}---${req.file.filename}`,
        caption: req.body.caption,
        contentType: mime.lookup(req.file.path),
        author: req.jwt.name,
        authorEmail: req.jwt.email
    };
    uploadFile(fileInfo, res);
};

exports.retrieveImage = (req, res) => {
    let key = `${req.params.id}---${req.params.filename}`;
    retrieveFile(key, res);
};

let uploadFile = (fileInfo, res) => {
    console.log(fileInfo)

    fs.readFile(fileInfo.source, (err, fileData) => {
        if (err) {
            return res.status(500).send({error: err});
        }

        const params = {
            Bucket: process.env.AWS_S3_BUCKET_BINARIES,
            Key: fileInfo.key,
            Body: fileData,
            ContentType: fileInfo.contentType,
            Metadata: {
                'Author': fileInfo.author,
                'Email': fileInfo.authorEmail
            }
        };

        //Upload image to S3 bucket
        s3.upload(params, (err, data) => {
            if (err) {
                return res.status(500).send({error: err});
            }

            let keys = fileInfo.key.split('---');
            const imageData = {
                _id: keys[0],
                fileName: keys[1],
                caption: fileInfo.caption,
                author: fileInfo.author
            };

            //After successful upload save the image info to Image Mongo model
            ImageModel.saveImage(imageData);

            //After successful upload delete the local image
            fs.unlink(fileInfo.source, (err) => {
                if (err) throw err;
                console.log(`${fileInfo.source} deleted.`)
            });

            return res.send(data);
        });
    });
};

let retrieveFile = (key, res) => {
    const getParams = {
        Bucket: process.env.AWS_S3_BUCKET_BINARIES,
        Key: key
    };

    s3.getObject(getParams, function (err, data) {
        if (err) {
            return res.status(400).send({success: false, err: err});
        } else {
            return res.send(data);
        }
    });
};


