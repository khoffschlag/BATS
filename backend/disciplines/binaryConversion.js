const { bitComparison } = require('../utils')

function getBinaryConversionTheory() {
    return { title: "Binary Conversion", description: "Here could be an explanation for the conversion from binary to decimal!" };
}

function getBinaryConversionExercise() {
    decimalNumber = Math.floor(Math.random() * 255) + 1;   // Create number between 1 and 255
    binaryRepresentation = decimalNumber.toString(2);
    targetAnswer = Array(8).fill(0);
    
    for (let i = binaryRepresentation.length - 1; i >= 0; i--) {
        targetAnswer[i] = binaryRepresentation[i];
    }

    return { title: "Binary Conversion", task: `Convert ${decimalNumber} to binary.`, targetAnswer: targetAnswer };
}

function checkBinaryConversionExercise(userAnswer, targetAnswer) {

    return bitComparison(userAnswer, targetAnswer);

}

module.exports = { getBinaryConversionTheory, getBinaryConversionExercise, checkBinaryConversionExercise };
