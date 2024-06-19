function getDecimalConversionTheory() {
    return { title: "Binary to Decimal Conversion", description: "Here could be an explanation for the conversion from decimal to binary!" };
}

function getDecimalConversionExercise() {
    decimalNumber = Math.floor(Math.random() * 512) + 1;   // Create number between 1 and 512
    binaryRepresentation = decimalNumber.toString(2);

    return { title: "Binary to Decimal Conversion", task: `Convert ${binaryRepresentation} to decimal.`, targetAnswer: decimalNumber };
}

function checkDecimalConversionExercise(userAnswer, targetAnswer) {

    let result, feedback;

    if (userAnswer == targetAnswer) {
        result = true;
        feedback = 'Well done! Your answer is correct!';
    }
    else {
        result = false;
        let difference = Math.abs(targetAnswer - userAnswer);
        difference = Math.ceil(difference / 10) * 10;  // Round up to the nearest number that can be divided by 10 without any rest

        feedback = `Unfortunately, your answer is wrong. Your up to +- ${difference} away from the real answer!`
    }

    return { result: result, feedback: feedback };

}

module.exports = { getDecimalConversionTheory, getDecimalConversionExercise, checkDecimalConversionExercise };
