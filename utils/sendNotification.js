
const admin = require("firebase-admin");

const sendNotification = async (message) => {
    admin
        .messaging(

        )
        .send(message)
        .then((response) => {
            console.log("Successfully sent message:", response);
        })
        .catch((error) => {
            console.log("Error sending message:", error);
        });
}

module.exports = sendNotification;