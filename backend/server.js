const express = require("express")
const app = express();
const port = 3000;

app.use(express.json());

app.get("/api/theory/binaryConversion", function (req, res) {
    res.json({topic: "Binary Conversion", description: "0 and 1 are binary numbers. Crazy innit?"});
})

app.get("/api/exercise/binaryConversion", function (req, res) {
    decimalNumber = Math.floor(Math.random() * 1000) + 1;   // Create number between 1 and 1000
    binaryNumber = decimalNumber.toString(2);  // Convert decimal number to binary
        res.json({topic: "Binary Conversion", task: `Convert ${decimalNumber} to binary.`, targetAnswer: binaryNumber});
})

app.post("/api/check/binaryConversion", function (req, res) {
    let result, feedback;
    const { userAnswer, targetAnswer } = req.body;
    
    if (userAnswer == targetAnswer) {
        result = true;
        feedback = "You're answer is correct! You're good!"
    }
    else {
        result = false;
        feedback = "Wrong answer.Get better!"
    }

    res.json({result: result, feedback: feedback});
})


app.listen(port, () => {
    console.log("Express running like Usain Bolt! Yeah!")
})
