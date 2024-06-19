// First we need to import the theory, exercise and check methods of the corresponding disciplines
const { getBinaryConversionTheory, getBinaryConversionExercise, checkBinaryConversionExercise } = require('./disciplines/binaryConversion');
const { getDecimalConversionTheory, getDecimalConversionExercise, checkDecimalConversionExercise } = require('./disciplines/decimalConversion');
const { getBinaryArithmeticTheory, getBinaryArithmeticExercise, checkBinaryArithmeticExercise } = require('./disciplines/binaryArithmetic');
const { getLogicalOperationsTheory, getLogicalOperationsExercise, checkLogicalOperationsExercise } = require('./disciplines/logicalOperations');

const express = require("express")
const app = express();
const port = 3000;

app.use(express.json());
app.use((req, res, next) => { 
    res.header("Access-Control-Allow-Origin",  
               "http://localhost:4200"); 
    res.header("Access-Control-Allow-Headers",  
               "Origin, X-Requested-With, Content-Type, Accept"); 
    next(); 
}); 

app.post("/api/theory", function (req, res) {
    const { topic } = req.body;

    console.log(`/api/theory/ got called with topic: ${topic}`);

    // Let's check if topic is undefinied, empty string or similiar
    if (!topic) {
        res.status(400).json({ error: 'No topic was submitted in the POST request!' });  // Send bad request error!
    }

    let title, description;
    switch(topic) {
        case 'binaryConversion':
            var response = getBinaryConversionTheory();
            break;
        case 'decimalConversion':
            var response = getDecimalConversionTheory();
            break;
        case 'binaryArithmetic':
            var response = getBinaryArithmeticTheory();
            break;
        case 'logicalOperations':
            var response = getLogicalOperationsTheory();
            break;
        default:
            res.status(400).json({ error: 'Invalid topic was submitted!' });
    }
    title = response.title;
    description = response.description;

    res.json({ title: title, description: description });
})

app.post("/api/exercise/", function (req, res) {
    const { topic } = req.body;

    console.log(`/api/exercise/ got called with topic: ${topic}`);

    // Let's check if topic is undefinied, empty string or similiar
    if (!topic) {
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

    res.json({ topic: topic, task: task, targetAnswer: targetAnswer });

})

app.post("/api/check/", function (req, res) {
    const { data } = req.body;

    console.log(data);
    
    let topic = data.topic;
    let userAnswer = data.userAnswer;
    let targetAnswer = data.targetAnswer;

    console.log(`/api/check/ got called with topic: ${topic}, userAnswer: ${userAnswer} and targetAnswer: ${targetAnswer}`);

    // Let's check if topic, userAnswer or targetAnswer is undefinied, empty string or similiar
    if (!topic) {
        res.status(400).json({ error: 'No topic was submitted in the POST request!' });  // Send bad request error!
    }

    if (!userAnswer) {
        res.status(400).json({ error: 'No userAnswer was submitted in the POST request!' });  // Send bad request error!
    }

    if (!targetAnswer) {
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


app.listen(port, () => {
    console.log("Express running like Usain Bolt! Yeah!")
})
