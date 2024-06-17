function getBinaryConversionTheory() {
    return { title: "Binary Conversion", description: "Here could be an explanation for the conversion from binary to decimal!" };
}

function getBinaryConversionExercise() {
    decimalNumber = Math.floor(Math.random() * 1000) + 1;   // Create number between 1 and 1000
    binaryNumber = decimalNumber.toString(2);
    return { title: "Binary Conversion", task: `Convert ${decimalNumber} to binary.`, targetAnswer: binaryNumber };
}

function checkBinaryConversionExercise(userAnswer, targetAnswer) {

    let result, feedback;
    
    if (userAnswer == targetAnswer) {
        result = true;
        feedback = "You're answer is correct! You're good!";
    } else {
        result = false;
        feedback = "Wrong answer.";
        
        if (targetAnswer.length != userAnswer.length) {
            feedback += `You're answer should have ${targetAnswer.length} digits and not only ${userAnswer.length}. Please double check your calculations!`;
        } else {
            const different_positions = [];
            for (let i = 0; i < userAnswer.length; i++) {
                if (userAnswer[i] !== targetAnswer[i]) {
                    different_positions.push(i+1);
                }
            }
            feedback += `The following position(s) wrong: ${different_positions}`;
        }
    }

    return { result: result, feedback: feedback };

}

module.exports = { getBinaryConversionTheory, getBinaryConversionExercise, checkBinaryConversionExercise };
