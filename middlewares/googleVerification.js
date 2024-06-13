const jwt = require('jsonwebtoken');
const path = require('path');
const userModel = require('../models/userModel');

require('dotenv').config({path: path.resolve(__dirname, '../config.env')});

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        console.log(token);
        const verifyUrl = `https://oauth2.googleapis.com/tokeninfo?access_token=${token}`;
        fetch(verifyUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => {
            return response.json();
        }).then(async data => {
            console.log("DATA", data);
            const isVerified = data.email_verified;
            console.log("isVerified", isVerified);
            if (isVerified === 'true') {
                // User is verified, create a JWT token

                const jwtToken = jwt.sign({email: data.email}, process.env.JWT_SECRET);

                // Send the JWT token in the response
                res.status(200).send({status: 'ok', auth: true, token: jwtToken});
            } else {
                res.status(401).json({
                    status: 'error',
                    message: "unauthorized user"
                });
            }
        })
    } catch (error) {
        return res.status(401).json({
            status: 'error',
            message: "Auth failed"
        });
    }
}