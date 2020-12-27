const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        let bearerToken = bearer[1];
        bearerToken = bearerToken.replace(/"/g, '');
        req.token = bearerToken;
        jwt.verify(req.token, process.env.JWT_SECRET, (err) => {
            if (err) {
                console.error(err);
                res.sendStatus(403);
            } else {
                next();
            }
        });
    } else {
        res.sendStatus(403);
    }
};

module.exports = verifyToken;