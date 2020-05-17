const fs = require('fs');
const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: process.env.IAM_ACCESS_KEY,
    secretAccessKey: process.env.IAM_SECRET_KEY,
    //region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

exports.uploadImage = (req, res) => {
    uploadFile(req.file.path, req.file.filename, res);
};

let uploadFile = function (source, target, res) {
    fs.readFile(source, (err, fileData) => {
        if (err) {
            return res.status(500).send({error: err});
        }

        const putParams = {
            Bucket: process.env.AWS_S3_BUCKET_BINARIES,
            Key: target,
            Body: fileData
        };

        s3.putObject(putParams, (err, data) => {
            if (err) {
                return res.status(500).send({error: err});
            }

            fs.unlink(source, (err) => {
                if (err) throw err;
                console.log(`${source} deleted.`)
            });

            return res.send({success: true});
        });
    });
};


