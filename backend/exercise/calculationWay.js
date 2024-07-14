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
    return 'Here could be a calculation way!';
}


function getLogicalOperationsCalculationWay(task, targetAnswer) {
    return 'Here could be a calculation way!';
}

module.exports = { showCalculationWay };