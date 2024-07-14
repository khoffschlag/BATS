function showCalculationWay(topic, task, targetAnswer) {
    switch(topic) {
        case 'binaryConversion':
            var response = getBinaryConversionCalculationWay(task, targetAnswer);
            break;
        case 'decimalConversion':
            var response = getDecimalConversionCalculationWay(task, targetAnswer);
            break;
        case 'binaryArithmetic':
            var response = getBinaryArithmeticCalculationWay(task, targetAnswer);
            break;
        case 'logicalOperations':
            var response = getLogicalOperationsCalculationWay(task, targetAnswer);
            break;
    }

    return response;
}


function getBinaryConversionCalculationWay(task, targetAnswer) {
    let decimalNumber = Number(task.match(/\d+/g));
    let binaryNumber = '';

    if (decimalNumber == 0) {
        calculationWay = `The binary representation of 0 is also 0!`;
    }
    else {
        calculationWay = `To convert the decimal number ${decimalNumber} to binary follow the following steps: \n`;

        let step = 1;
        let remainder;
        let nextDecimalNumber;
        while (decimalNumber > 0) {
            remainder = decimalNumber % 2;
            nextDecimalNumber = Math.floor(decimalNumber / 2);

            calculationWay += `Step ${step}: ${decimalNumber} / 2 = ${nextDecimalNumber} with remainder  ${remainder} \n`;

            step += 1;
            binaryNumber += remainder.toString();
            decimalNumber = nextDecimalNumber;
        }

        calculationWay += `and if you now read the remainders in the correct order, you have the binary representation of the decimal number!`;

    }

    return calculationWay;
}


function getDecimalConversionCalculationWay(task, targetAnswer) {
    let binaryNumber = String(task.match(/\d+/g));

    let calculationWay = `In order to conver the binary number ${binaryNumber} to decimal, you can calculate the result of: \n`;

    amountBits = binaryNumber.length;
    for (let pow = 0; pow < amountBits; pow++) {
        currentBit = binaryNumber.charAt(amountBits - pow - 1);

        if (pow == amountBits - 1) {
            calculationWay += `${currentBit} * 2^${pow}`;
        }
        else {
            calculationWay += `${currentBit} * 2^${pow} + `;
        }

    }

    return calculationWay;
}


function getBinaryArithmeticCalculationWay(task, targetAnswer) {

    matches = task.match(/\b[01]+\b/g);
    let number1 = String(matches[0]);
    let number2 = String(matches[1]);

    let calculationWay = `In order to add the binary numbers ${number1} and ${number2} follow the following steps: \n`;

    maxLength = Math.max(number1.length, number2.length);
    number1 = number1.padStart(maxLength, '0');
    number2 = number2.padStart(maxLength, '0');

    let bit1, bit2, sum, resultBit;
    let carry = 0;
    let previousCarry = 0;
    let step = 1;
    for (let i = maxLength - 1; i >= 0; i--) {
        bit1 = Number(number1[i]);
        bit2 = Number(number2[i]);
        previousCarry = carry;
        sum = bit1 + bit2 + carry;
        
        if (sum === 0) {
            resultBit = 0;
            carry = 0;
        } else if (sum === 1) {
            resultBit = 1;
            carry = 0;
        } else if (sum === 2) {
            resultBit = 0;
            carry = 1;
        } else if (sum === 3) {
            resultBit = 1;
            carry = 1;
        }

        calculationWay += `Step ${step}: ${bit1} + ${bit2} (+ carry of ${previousCarry}) results in ${resultBit} and carry of ${carry}. \n`;
        step += 1;
        
    }

    return calculationWay;
}


function getLogicalOperationsCalculationWay(task, targetAnswer) {
    return 'Here could be a calculation way!';
}

module.exports = { showCalculationWay };