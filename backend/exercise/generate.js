function generateExercise(topic) {
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
    }

    return response;
}


function getBinaryConversionExercise() {
    decimalNumber = Math.floor(Math.random() * 254) + 1;   // Create number between 1 and 255
    targetAnswer = decimalNumber.toString(2).padStart(8, '0').split('');
    return { title: "Binary Conversion", task: `Convert ${decimalNumber} to binary.`, targetAnswer: targetAnswer };
}


function getDecimalConversionExercise() {
    decimalNumber = Math.floor(Math.random() * 254) + 1;   // Create number between 1 and 255
    binaryRepresentation = decimalNumber.toString(2);

    return { title: "Binary to Decimal Conversion", task: `Convert ${binaryRepresentation} to decimal.`, targetAnswer: decimalNumber };
}


function getBinaryArithmeticExercise() {
    decimalNumberOne = Math.floor(Math.random() * 127) + 1;
    decimalNumberTwo = Math.floor(Math.random() * 127) + 1;

    // Swapping to make our life easier in subtraction tasks
    if (decimalNumberTwo > decimalNumberOne) {
        let temp = decimalNumberOne;
        decimalNumberOne = decimalNumberTwo;
        decimalNumberTwo = temp;
    }

    const possibleOperators = ["+"];
    let selectedOperator = possibleOperators[Math.floor(Math.random() * possibleOperators.length)];  // Randomly choose an operator. Currently we have only one though...

    binaryNumberOne = decimalNumberOne.toString(2).padStart(8, '0');
    binaryNumberTwo = decimalNumberTwo.toString(2).padStart(8, '0');

    if (selectedOperator == "+") {
        calculationResult = (parseInt(binaryNumberOne, 2) + parseInt(binaryNumberTwo, 2)).toString(2);
    }

    targetAnswer = Array(8).fill(0);    
    for (let i = calculationResult.length - 1; i >= 0; i--) {
        targetAnswer[i] = calculationResult[i];
    }

    return { title: "Binary Arithmetic", task: `${binaryNumberOne} ${selectedOperator} ${binaryNumberTwo}`, targetAnswer: targetAnswer };
}


function getLogicalOperationsExercise() {

    const possibleOperators = ["&", "|", "xor"];
    let selectedOperator = possibleOperators[Math.floor(Math.random() * possibleOperators.length)];

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

module.exports = { generateExercise };