const jwt = require('jsonwebtoken');
const path = require("path");

require('dotenv').config({path: path.resolve(__dirname, '../config.env')});

module.exports = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
        return res.status(403).send({ auth: false, message: 'No token provided.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        }

        req.email = decoded.email;

        console.log("token verified", decoded);
        next();
    });
}