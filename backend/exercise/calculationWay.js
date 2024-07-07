function showCalculationWay(topic, task, userAnswer, targetAnswer) {
    switch(topic) {
        case 'binaryConversion':
            var response = getBinaryConversionCalculationWay(task, userAnswer, targetAnswer);
            break;
        case 'decimalConversion':
            var response = getDecimalConversionCalculationWay(task, userAnswer, targetAnswer);
            break;
        case 'binaryArithmetic':
            var response = getBinaryArithmeticCalculationWay(task, userAnswer, targetAnswer);
            break;
        case 'logicalOperations':
            var response = getLogicalOperationsCalculationWay(task, userAnswer, targetAnswer);
            break;
    }

    return response;
}


function getBinaryConversionCalculationWay(task, userAnswer, targetAnswer) {
    return 'Here could be a calculation way!';
}


function getDecimalConversionCalculationWay(task, userAnswer, targetAnswer) {
    return 'Here could be a calculation way!';
}


function getBinaryArithmeticCalculationWay(task, userAnswer, targetAnswer) {
    return 'Here could be a calculation way!';
}


function getLogicalOperationsCalculationWay(task, userAnswer, targetAnswer) {
    return 'Here could be a calculation way!';
}

module.exports = { showCalculationWay };