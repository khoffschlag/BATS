const { bitComparison } = require('../utils')

function getBinaryConversionTheory() {
    return { title: "Binary Conversion", description: "Here could be an explanation for the conversion from binary to decimal!" };
}

function getBinaryConversionExercise() {
    decimalNumber = Math.floor(Math.random() * 254) + 1;   // Create number between 1 and 255
    targetAnswer = decimalNumber.toString(2).padStart(8, '0').split('');
    return { title: "Binary Conversion", task: `Convert ${decimalNumber} to binary.`, targetAnswer: targetAnswer };
}

function checkBinaryConversionExercise(userAnswer, targetAnswer) {

    return bitComparison(userAnswer, targetAnswer);

}

module.exports = { getBinaryConversionTheory, getBinaryConversionExercise, checkBinaryConversionExercise };
