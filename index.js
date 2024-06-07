const express = require('express');
const mongoose = require('mongoose');
const { ApolloServer } = require('apollo-server-express');
// const { ApolloServer } = require('apollo-server');
const app = express();

const dbUrl = 'mongodb://localhost:27017/club';

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
    apiKey: "AIzaSyB3pYKZjyi6WALlWMbXf8_bXM6IcF57hgo",
    authDomain: "clubs-app-firebase.firebaseapp.com",
    projectId: "clubs-app-firebase",
    storageBucket: "clubs-app-firebase.appspot.com",
    messagingSenderId: "1034110949886",
    appId: "1:1034110949886:web:3331711f4e886ce4a708af"
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

            return {
                user: {
                    role: user.role,
                    id: user.id,
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