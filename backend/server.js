const isAuthenticated = require ("./isAuthenticated.js")

const { generateExercise } = require('./exercise/generate');
const { checkExercise } = require('./exercise/check');

const express = require("express");
const session = require('express-session');

const path = require('path');
const cors = require('cors');
const argon2 = require('argon2');
const MongoStore = require("connect-mongo");
require('dotenv').config();

const app = express();
const mongoose = require('mongoose');
const Tutorial = require('./models/tutorialModel');
const UserBehavior = require ('./models/userBehaviorModel');
const User = require ('./models/userModel');
const uri = process.env.MONGO_URI;

app.use(express.json());

//HEROKU
app.use(express.static(__dirname + '/dist/bats'));
app.get('/*', function(req, res) { res.sendFile(path.join(__dirname+'/dist/bats/index.html' ));});
//-----------------------------------------------

const corsOptions = {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
};

app.use(cors(corsOptions));


app.use(
    session({
        secret: process.env.SECRET_KEY,
        resave: false, // do not resave sessions that have not been changed
        saveUninitialized: true, // saves new sessions
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI,
            ttl: 24 * 60 * 60, // 1 day in seconds
        }),
        cookie: { secure: "auto", httpOnly: true, maxAge: 1000 * 60 * 60 * 24 },
    })
);

app.use((req, res, next) => {
    console.log('Session:', req.session);
    next();
});

// Registration for a new user
app.post("/api/sign-up", async (req, res) => {
    try {
        const {username, password, correctAnswerStreak} = req.body;
        console.log('retrieved signup data:',{username, password, correctAnswerStreak});
        const existing = await User.findOne({ username });

        if (existing) {
            return res.status(400).json({ message: "Username already taken."});
        }

        // creating a new user
        const user = new User({ username, password, correctAnswerStreak });
        await user.save();

        res.status(201).json({message: "User registered successfully."})
    }catch(error) {
        res.status(400).json(error)
    }
});

// Login 
app.post("/api/sign-in", async (req, res) => {
    try {
        const { username, password, correctAnswerStreak } = req.body;
        console.log('Received login request:', username);
        const user = await User.findOne({ username });
        console.log('Found user:', user);

        if (!user) {
            return res.status(401).json({ message: "Authentication failed" });
        }

        const passwordValid = await argon2.verify(user.password, password);

        if (!passwordValid) {
            return res.status(401).json({ message: "Authentication failed" });
        }   
        if (correctAnswerStreak) {
            user.correctAnswerStreak =correctAnswerStreak;
            await user.save();
        }

        // modify the session
        req.session.user = { id: user._id, username: user.username };
        console.log('Logged user:', { id: user._id, username: user.username });
        res.status(200).json({ message: "Logged in successfully" });
    }catch(error) {
        res.status(500).json(error);
    }
});

// Logout
app.post("/api/logout", (req, res) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                return res
                    .status(500)
                    .json({ message: "Could not log out, please try again" });
            } else {
                console.log("User logged out");
                res.send({ message: "Logout successful "});
            }
        });
    } else {
        res.status(400).json({ message: "You are not logged in "});
    }
});

app.get("/api/is-authenticated", isAuthenticated, (req, res) => {
    res.status(200).json({ isAuthenticated: req.isAuthenticated });
});


// Update correctAnswerStreak value
app.post("/api/update-streak", async (req, res) => {
    if (!req.session.user || !req.session.user.username) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const username = req.session.user.username;
        const correctAnswerStreak = req.body.correctAnswerStreak;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.correctAnswerStreak = correctAnswerStreak;
        await user.save();

        res.status(200).json({ message: "Streak updated successfully" });
    } catch (error) {
        res.status(500).json(error);
    }
});

app.get("/api/check-streak", async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        console.log("User in session: ", req.session.user.username)
        const username = req.session.user.username;
        const user = await User.findOne( {username} );
        if (!user) {
            console.log(user)
            return res.status(404).json({ message: "User not found" });
        }
        const streak = user.correctAnswerStreak || 0;
        res.status(200).json({ streak });

    } catch (error) {
        res.status(500).json(error);
    }
}
);

app.get("/api/users",async (req,res) =>{
    try{
        const users = await User.find({});
        res.status(200).json(users);
    } catch{
        res.status(500).json({message: "error fetching the users"});
    }
});


//Endpoint to get tutorial by title passed in the body
app.post("/api/theory", async (req, res) => {

    try {
        const { topic } = req.body;
        console.log(`/api/theory/ got called with topic: ${topic}`);

        if (topic == null | topic.length === 0) {
            res.status(400).json({ error: 'No topic was submitted in the POST request!' });  // Send bad request error!
        }

        const tutorials = await Tutorial.findOne({ codeName: new RegExp(topic)}).exec();
        console.log('Found tutorials:', tutorials); // Log found tutorials

        if (tutorials == null || tutorials.length === 0){
            return res.status(404).send({ message: 'No tutorial found.'});
        }
        res.status(200).json(tutorials);

    }catch(error) {
        res.status(500).json(error);
    }
});

app.post("/api/exercise/", function (req, res) {
    const { topic } = req.body;

    console.log(`/api/exercise/ got called with topic: ${topic}`);

    // Let's check if topic is undefined, empty string or similar
    if (topic == null | topic.length === 0) {
        res.status(400).json({ error: 'No topic was submitted in the POST request!' });  // Send bad request error!
    }

    response = generateExercise(topic);
    let title = response.title;
    let task = response.task;
    let targetAnswer = response.targetAnswer;

    res.json({ title: title, task: task, targetAnswer: targetAnswer });

})

app.post("/api/check/", function (req, res) {
    const { data } = req.body;

    console.log(data);
    
    let topic = data.topic;
    let task = data.task;
    let userAnswer = data.userAnswer;
    let targetAnswer = data.targetAnswer;
    let currentTry = data.currentTry;

    console.log(`/api/check/ got called with topic: ${topic}, userAnswer: ${userAnswer} and targetAnswer: ${targetAnswer}`);

    // Let's check if topic, userAnswer or targetAnswer is undefined, empty string or similar
    if (topic == null | topic.length === 0) {
        res.status(400).json({ error: 'No topic was submitted in the POST request!' });  // Send bad request error!
    }

    if (userAnswer == null) {
        res.status(400).json({ error: 'No userAnswer was submitted in the POST request!' });  // Send bad request error!
    }

    if (targetAnswer == null) {
        res.status(400).json({ error: 'No targetAnswer was submitted in the POST request!' });  // Send bad request error!
    }

    response = checkExercise(topic, task, userAnswer, targetAnswer, currentTry);
    let result = response.result;
    let feedback = response.feedback;
    res.json({ result: result, feedback: feedback });
})


app.get("/api/quiz/", function (req, res) {

    const possibleTopics = ['binaryConversion', 'decimalConversion', 'binaryArithmetic', 'logicalOperations'];
    let topic = possibleTopics[Math.floor(Math.random() * possibleTopics.length)];

    response = generateExercise(topic);
    let title = response.title;
    let task = response.task;
    let targetAnswer = response.targetAnswer;

    res.json({ topic:topic, title: title, task: task, targetAnswer: targetAnswer });
})


app.post("/api/log",  async (req, res) => {
    console.log("Logging Event is triggered");
    const { userId, eventType, eventData} = req.body;
    //console.log('Received data:', req.body);
    const userBehavior = new UserBehavior( { userId, eventType, eventData} );

    try{
        const savedBehavior = await userBehavior.save();
        //console.log('Saved log data:', savedBehavior);
        res.status(200).json({message: 'User behavior saved successfully'});

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Error saving user behavior." });
    }
});


async function run() {
    try {
        // try to connect to MongoDB using mongoose
        await mongoose.connect(uri, {
            serverApi: {
                version: '1', 
                strict: true,
                deprecationErrors: true,
            },
        });

        console.log("Successfully connected to MongoDB!");

        app.listen(process.env.PORT || 3000, () => {
            console.log("Express running like Usain Bolt! Yeah!");
        });
    }catch(error) {
        console.error("Oopsi, not connection for you");
    } finally {
      // Ensures that the connection is closed when application terminated
      process.on('SIGINT', async () => {
        await mongoose.connection.close();
        console.log('Mongoose connection closed');
        process.exit(0);
        });
    }
  }
  run().catch(console.dir);