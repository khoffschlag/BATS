const { showCalculationWay } = require("./calculationWay");

function checkExercise(topic, task, userAnswer, targetAnswer, currentTry) {
  if (userAnswer.toString() == targetAnswer.toString()) {
    return { result: true, feedback: "Well done! Your answer is correct!" };
  }

  // Everything that follows are cases where the user answer was incorrect!
  if (currentTry == 0) {
    return { result: false, feedback: "Wrong answer. Please try again!" };
  }

  if (currentTry == 1) {
    return {
      result: false,
      feedback: showCalculationWay(topic, task, userAnswer),
    };
  }

  if (currentTry == 2) {
    if (topic == "decimalConversion") {
      return {
        result: false,
        feedback: checkDecimalConversionExercise(userAnswer, targetAnswer)
          .feedback,
      };
    } else {
      return {
        result: false,
        feedback: bitComparison(userAnswer, targetAnswer).feedback,
      };
    }
  }

  if (currentTry >= 3) {
    return { result: false, feedback: `The correct answer is ${targetAnswer}` };
  }
}

function bitComparison(userAnswer, targetAnswer) {
  let result, feedback;
  let different_positions = [];

  for (let i = 0; i < 8; i++) {
    if (userAnswer[i] != targetAnswer[i]) {
      different_positions.push(i + 1);
    }
  }

  if (different_positions.length == 0) {
    result = true;
    feedback = "You're answer is correct! Well done!";
  } else {
    result = false;
    feedback = "Wrong answer. ";
    feedback += `The following position(s) wrong: ${different_positions}`;
  }

  return { result: result, feedback: feedback };
}

function checkDecimalConversionExercise(userAnswer, targetAnswer) {
  let result, feedback;

  if (userAnswer == targetAnswer) {
    result = true;
    feedback = "Well done! Your answer is correct!";
  } else {
    result = false;
    let difference = Math.abs(targetAnswer - userAnswer);
    difference = Math.ceil(difference / 10) * 10; // Round up to the nearest number that can be divided by 10 without any rest

    feedback = `Unfortunately, your answer is wrong. Your up to +- ${difference} away from the real answer!`;
  }

  return { result: result, feedback: feedback };
}

module.exports = checkExercise;
