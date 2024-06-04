const express = require("express")
const app = express();
const port = 3000;

app.get("/api/theory/binaryConversion", function (req, res) {
    res.json({topic: "Binary Conversion", description: "0 and 1 are binary numbers. Crazy innit?"});
})

app.get("/api/exercise/binaryConversion", function (req, res) {
    res.json({topic: "Binary Conversion", task: "Convert 12 to binary.", answer: "1100"});
})

app.listen(port, () => {
    console.log("Express running like Usain Bolt! Yeah!")
})
