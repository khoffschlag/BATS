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

    let result, feedback;
    let different_positions = [];

    for (let i = 0; i < 8; i++) {
        if (userAnswer[i] != targetAnswer[i]) {
            different_positions.push(i+1);
        }
    }

    if (different_positions.length == 0) {
        result = true;
        feedback = "You're answer is correct! Well done!";
    }
    else {
        result = false;
        feedback = "Wrong answer. ";
        feedback += `The following position(s) wrong: ${different_positions}`;

    }
    
    return { result: result, feedback: feedback };

}

module.exports = { getLogicalOperationsTheory, getLogicalOperationsExercise, checkLogicalOperationsExercise };
