
const { generateExercise } = require('./exercise/generate');
const { checkExercise } = require('./exercise/check');

const express = require("express");
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = 3000;

const mongoose = require('mongoose');
const Tutorial = require('./models/tutorialModel');
const UserBehavior = require ('./models/userBehaviorModel')
const { isAsyncIterable } = require('rxjs/internal/util/isAsyncIterable');
const uri = process.env.MONGO_URI;

app.use(express.json());
app.use(cors());

app.use((req, res, next) => { 
    res.header("Access-Control-Allow-Origin",  
               "http://localhost:4200"); 
    res.header("Access-Control-Allow-Headers",  
               "Origin, X-Requested-With, Content-Type, Accept"); 
    next(); 
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
        res.status(500).send(error);
    }
});

app.post("/api/exercise/", function (req, res) {
    const { topic } = req.body;

    console.log(`/api/exercise/ got called with topic: ${topic}`);

    // Let's check if topic is undefinied, empty string or similiar
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

    // Let's check if topic, userAnswer or targetAnswer is undefinied, empty string or similiar
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
    console.log('Received data:', req.body);
    const userBehavior = new UserBehavior( { userId, eventType, eventData} );

    try{
        const savedBehavior = await userBehavior.save();
        console.log('Saved log data:', savedBehavior);
        res.status(200).send('User behavior saved successfully');

    } catch (err) {
        console.error(err);
        return res.status(500).send("Error saving user behavior.");
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

        app.listen(port, () => {
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