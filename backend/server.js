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

app.get("/api/theory/binaryConversion", function (req, res) {
    res.json({topic: "Binary Conversion", description: "0 and 1 are binary numbers. Crazy innit?"});
})

app.get("/api/exercise/binaryConversion", function (req, res) {
    decimalNumber = Math.floor(Math.random() * 1000) + 1;   // Create number between 1 and 1
    binaryNumber = decimalNumber.toString(2);
    res.json({topic: "Binary Conversion", task: `Convert ${decimalNumber} to binary.`, targetAnswer: binaryNumber});
})

app.post("/api/check/binaryConversion", function (req, res) {
    let result, feedback;
    const { userAnswer, targetAnswer } = req.body;
    
    if (userAnswer == targetAnswer) {
        result = true;
        feedback = "You're answer is correct! You're good!"
    } else {
        result = false;
        feedback = "Wrong answer.";
        
        if (targetAnswer.length != userAnswer.length) {
            feedback += `You're answer should have ${targetAnswer.length} digits and not only ${userAnswer.length}. Please double check your calculations!`;
        } else {
            const different_positions = [];
            for (let i = 0; i < userAnswer.length; i++) {
                if (userAnswer[i] !== targetAnswer[i]) {
                    different_positions.push(i+1)
                }
            }
            feedback += `The following position(s) wrong: ${different_positions}`;
        }
    }

    res.json({result: result, feedback: feedback});
})


app.listen(port, () => {
    console.log("Express running like Usain Bolt! Yeah!")
})
