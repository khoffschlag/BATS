function bitComparison(userAnswer, targetAnswer) {

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

module.exports = { bitComparison };
