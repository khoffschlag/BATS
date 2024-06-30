// First we need to import the theory, exercise and check methods of the corresponding disciplines
const { getBinaryConversionTheory, getBinaryConversionExercise, checkBinaryConversionExercise } = require('./disciplines/binaryConversion');
const { getDecimalConversionTheory, getDecimalConversionExercise, checkDecimalConversionExercise } = require('./disciplines/decimalConversion');
const { getBinaryArithmeticTheory, getBinaryArithmeticExercise, checkBinaryArithmeticExercise } = require('./disciplines/binaryArithmetic');
const { getLogicalOperationsTheory, getLogicalOperationsExercise, checkLogicalOperationsExercise } = require('./disciplines/logicalOperations');

const express = require("express");
require('dotenv').config();
const app = express();
const port = 3000;

const mongoose = require('mongoose');
const Tutorial = require('./models/tutorialModel');
const { isAsyncIterable } = require('rxjs/internal/util/isAsyncIterable');
const uri = process.env.MONGO_URI;

app.use(express.json());
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

    let title, task, targetAnswer;
    switch(topic) {
        case 'binaryConversion':
            var response = getBinaryConversionExercise();
            break;
        case 'decimalConversion':
            var response = getDecimalConversionExercise();
            break;
        case 'binaryArithmetic':
            var response = getBinaryArithmeticExercise();
            break;
        case 'logicalOperations':
            var response = getLogicalOperationsExercise();
            break;
        default:
            res.status(400).json({ error: 'Invalid topic was submitted!' });
    }
    title = response.title;
    task = response.task;
    targetAnswer = response.targetAnswer;

    res.json({ title: title, task: task, targetAnswer: targetAnswer });

})

app.post("/api/check/", function (req, res) {
    const { data } = req.body;

    console.log(data);
    
    let topic = data.topic;
    let userAnswer = data.userAnswer;
    let targetAnswer = data.targetAnswer;

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

    let result, feedback;
    switch(topic) {
        case 'binaryConversion':
            var response = checkBinaryConversionExercise(userAnswer, targetAnswer);
            break;
        case 'decimalConversion':
            var response = checkDecimalConversionExercise(userAnswer, targetAnswer);
            break;
        case 'binaryArithmetic':
            var response = checkBinaryArithmeticExercise(userAnswer, targetAnswer);
            break;
        case 'logicalOperations':
            var response = checkLogicalOperationsExercise(userAnswer, targetAnswer);
            break;
        default:
            res.status(400).json({ error: 'Invalid topic was submitted!' });
    }
    result = response.result;
    feedback = response.feedback;

    res.json({ result: result, feedback: feedback });
})

async function run() {
    try {
        // try to connect to MongoDB using mongoose
        await mongoose.connect(uri, {
            serverApi: {
                version: '1', 
                strict: true,
                deprecationErrors: true,
            }
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