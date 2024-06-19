const { bitComparison } = require('../utils')

function getLogicalOperationsTheory() {
    return { title: "Logical Operations", description: "Here could be an explanation for logical operations!" };
}

function getLogicalOperationsExercise() {

    const possibleOperators = ["&", "|", "xor"];
    let selectedOperator = possibleOperators[Math.floor(Math.random() * possibleOperators.length)];  // Randomly choose an operator. Currently we have only one though...

    numberOne = Math.floor(Math.random() * 255) + 1;
    numberTwo = Math.floor(Math.random() * 255) + 1;

    if (selectedOperator == "&") {
        calculationResult = numberOne & numberTwo;
    }
    else if (selectedOperator == "|") {
        calculationResult = numberOne | numberTwo;
    }
    else if (selectedOperator == "xor") {
        calculationResult = numberOne ^ numberTwo;
    }

    numberOne = numberOne.toString(2);
    numberTwo = numberTwo.toString(2);
    let resultInBinary = calculationResult.toString(2).padStart(8, '0');
    let targetAnswer = Array.from(resultInBinary, Number);

    return { title: "Logical Operations", task: `${numberOne} ${selectedOperator} ${numberTwo}`, targetAnswer: targetAnswer };

}

function checkLogicalOperationsExercise(userAnswer, targetAnswer) {
    
    return bitComparison(userAnswer, targetAnswer);

}

module.exports = { getLogicalOperationsTheory, getLogicalOperationsExercise, checkLogicalOperationsExercise };
