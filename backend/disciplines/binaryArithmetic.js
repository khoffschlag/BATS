const { bitComparison } = require('../utils')

function getBinaryArithmeticTheory() {
    return { title: "Binary Arithmetic", description: "Here could be an explanation for binary arithmetic!" };
}

function getBinaryArithmeticExercise() {
    decimalNumberOne = Math.floor(Math.random() * 128) + 1;
    decimalNumberTwo = Math.floor(Math.random() * 128) + 1;

    // Swapping to make our life easier in subtraction tasks
    if (decimalNumberTwo > decimalNumberOne) {
        let temp = decimalNumberOne;
        decimalNumberOne = decimalNumberTwo;
        decimalNumberTwo = temp;
    }

    const possibleOperators = ["+"];
    let selectedOperator = possibleOperators[Math.floor(Math.random() * possibleOperators.length)];  // Randomly choose an operator. Currently we have only one though...

    binaryNumberOne = decimalNumberOne.toString(2);
    binaryNumberTwo = decimalNumberTwo.toString(2);

    if (selectedOperator == "+") {
        calculationResult = (parseInt(binaryNumberOne, 2) + parseInt(binaryNumberTwo, 2)).toString(2);
    }

    targetAnswer = Array(8).fill(0);    
    for (let i = calculationResult.length - 1; i >= 0; i--) {
        targetAnswer[i] = calculationResult[i];
    }

    return { title: "Binary Arithmetic", task: `${binaryNumberOne} ${selectedOperator} ${binaryNumberTwo}`, targetAnswer: targetAnswer };
}

function checkBinaryArithmeticExercise(userAnswer, targetAnswer) {

    return bitComparison(userAnswer, targetAnswer);

}

module.exports = { getBinaryArithmeticTheory, getBinaryArithmeticExercise, checkBinaryArithmeticExercise };
