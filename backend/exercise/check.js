const showCalculationWay = require("./calculationWay");

/**
 * Check user answer and return progressive feedback if user answer is wrong.
 * @method checkExercise
 * @param {String} topic - Topic (i.e., binaryConversion, decimalConversion, binaryArithmetic, logicalOperations)
 * @param {String} task - The generated task
 * @param {String} userAnswer - The user answer
 * @param {String} targetAnswer - The correct answer
 * @param {String} currentTry - How often the user has already tried this exercise (i.e., 0 -> first time, 1 -> once wrong, etc.)
 * @returns {String} Progressive feedback
 */
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

/**
 * Compare two binary numbers for differences between the digits
 * @method bitComparison
 * @param {String} userAnswer - The user answer
 * @param {String} targetAnswer - The correct answer
 * @returns {String} If provided numbers are not equal, return text which explains which bits are not equal.
 */
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

/**
 * Calculate rough displacement between user answer and target answer as one possible feedback for decimal conversion
 * @method checkDecimalConversionExercise
 * @param {String} userAnswer - The user answer
 * @param {String} targetAnswer - The correct answer
 * @returns {String} Text which explains the rough displacement between user answer and target answer in case these inputs are not equal
 */
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
