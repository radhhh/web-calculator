const MAXINPUT = 20;
let rawNumber = [];
let number = null;
let operator = ' ';
let operand = null;
let sign = 1;

function resetValue(){
    rawNumber = [];
    number = null;
    operator = ' ';
    operand = null;
    sign = 1;
}

function flushPrimary(content){
    // console.log(`primary = ${content}`);
    const primaryDisplay = document.querySelector('#current');
    primaryDisplay.textContent = content;
}

function flushSecondary(content){
    // console.log(`secondary = ${content}`);
    const secondaryDisplay = document.querySelector('#previous');
    secondaryDisplay.textContent = content;
}

function flushDisplay(){
    if(rawNumber.length) flushPrimary(rawNumber.join(''));
    else if(number == null) flushPrimary('');
    else flushPrimary(number);
    if(operand == null) flushSecondary('');
    else flushSecondary(operand + ' ' + operator);
}


function evaluate(){
    console.log(`evaluate ${operand} & ${number}`)
    switch(operator){
        case '+':
            return operand + number;
        case '-':
            return operand - number;
        case 'x':
            return operand * number;
        case '/':
            if(number == 0) return undefined;
            return operand / number;
        case '^':
            return operand ** number;
    }
}

function handleException(){
    resetValue();
    flushPrimary('angkanya invalid anj');
    flushSecondary('');
}
                    
                    
function handleInputNumber(e){
    let inputChar = e.target.textContent;
    if(rawNumber.length >= MAXINPUT) return;
    if(rawNumber.length == 1 && rawNumber[0] == '0'){
        if(inputChar == '0') return;
        rawNumber.pop();
    }
    rawNumber.push(inputChar);
    number = parseFloat(rawNumber.join(''));
    flushDisplay();
}

function handleOperations(e){
    let currentOperator = e.target.textContent;
    if(operator == ' '){
        operand = number;
        number = null;
        rawNumber = [];
    }
    else if(number != null){
        operand = evaluate();
        number = null;
        rawNumber = [];
    }
    operator = currentOperator;
    if(operand === undefined) handleException();
    else flushDisplay();
}

function handleEqual(){
    if(operator == ' ') return;
    if(!rawNumber.length){
        operator = ' ';
        return;
    }
    number = evaluate();
    operator = ' ';
    operand = null;
    rawNumber = [];
    if(number === undefined) handleException();
    else flushDisplay();
}

function handleDecimal(){
    if(rawNumber.includes('.')) return;
    rawNumber.push('.');
    flushDisplay();
}

function handleDelete(){
    if(!rawNumber.length) return;
    rawNumber.pop();
    number = parseFloat(rawNumber.join(''));
    if(Number.isNaN(number)) number = null;
    console.log(number);
    flushDisplay();
}

const numberButtons = document.querySelectorAll('.numbers');
numberButtons.forEach((currentButton) => {
    currentButton.addEventListener('click', handleInputNumber);
});

const operationButtons = document.querySelectorAll('.operations');
operationButtons.forEach((currentButton) => {
    currentButton.addEventListener('click', handleOperations);
})

const equalButton = document.querySelector('#equal')
equalButton.addEventListener('click', handleEqual);

const decimalButton = document.querySelector('#decimal');
decimalButton.addEventListener('click', handleDecimal);

const clearButton = document.querySelector('#clear');
clearButton.addEventListener('click', () => {
    resetValue();
    flushDisplay();
});

const deleteButton = document.querySelector('#delete');
deleteButton.addEventListener('click', handleDelete);
