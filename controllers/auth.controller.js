const jwt = require('jsonwebtoken');
const crypto = require('crypto');

exports.login = (req, res) => {
    try {
        let refreshId = req.body.userId + process.env.AUTH_SECRET;
        let salt = crypto.randomBytes(16).toString('base64');
        let hash = crypto.createHmac('sha512', salt).update(refreshId).digest("base64");
        req.body.refreshKey = salt;
        let token = jwt.sign(req.body, process.env.AUTH_SECRET);
        let b = new Buffer(hash);
        let refresh_token = b.toString('base64');
        res.status(201).send({accessToken: token, refreshToken: refresh_token});
    } catch (err) {
        res.status(500).send({errors: err});
    }
};

exports.logout = (req, res) => {
    res.status(204).send({accessToken: null, refreshToken: null});
};
