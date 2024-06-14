const express = require('express');
const mongoose = require('mongoose');
const { ApolloServer } = require('apollo-server-express');
// const { ApolloServer } = require('apollo-server');
const app = express();

const dbUrl = process.env.DB_URL;

const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolver');

const userModel = require('./models/userModel');

var serviceAccount = require("./serviceAccountKey.json");

// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries



const admin = require("firebase-admin");

// Your web app's Firebase configuration
const firebaseConfig = {
    credential: admin.credential.cert(serviceAccount),
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
};

// Initialize Firebase
admin.initializeApp(firebaseConfig);


mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1);
    });

const server = new ApolloServer({ typeDefs, resolvers});

const googleVerification = require('./middlewares/googleVerification');
const verifyToken = require('./middlewares/verifyToken');

app.get('/hello', (req, res) => {

    const sendNotification = require('./utils/sendNotification');

    const message = {
        data: {
            largeIcon: 'https://via.placeholder.com/100x100', // *
            image: 'https://via.placeholder.com/200x200',
            title: 'SKG...',
            body: 'Hellooo3 from SKG',
        },
        topic: "clubs-app-fcm",
    };

    sendNotification(message);

    res.send('Hello World');
});

app.use('/googleVerification', googleVerification);
app.use('/graphql', verifyToken);

async function startApolloServer() {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: async ({req}) => {

            const user = await userModel.findOne({email: req.email});
            const role = user == null ? 'user' : user.role;
            const id = user == null ? '' : user.id;
            // console.log('USER', user);
            return {
                user: {
                    role: role,
                    id: id,
                }
            }
        }
    });

    await server.start();
    server.applyMiddleware({ app, path: "/graphql" });

    app.listen({ port: 4000 }, () =>
        console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
    );

}
startApolloServer();


// server.listen().then(({ url }) => {
//     console.log(`🚀 Server ready at ${url}`);
// });