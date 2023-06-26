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
    if(rawNumber.length) flushPrimary((sign == -1 ? '-' : '') + rawNumber.join(''));
    else if(number == null) flushPrimary(sign == -1 ? '-' : '');
    else flushPrimary(sign*number);
    if(operand == null) flushSecondary('');
    else flushSecondary(operand + ' ' + operator);
}


function evaluate(){
    console.log(`evaluate ${operand} & ${number}`)
    number *= sign;
    sign = 1;
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
                    
                    
function handleInputNumber(inputChar){
    if(rawNumber.length >= MAXINPUT) return;
    if(rawNumber.length == 1 && rawNumber[0] == '0'){
        if(inputChar == '0') return;
        rawNumber.pop();
    }
    rawNumber.push(inputChar);
    number = parseFloat(rawNumber.join(''));
    flushDisplay();
}

function handleOperations(currentOperator){
    if(operator == ' '){
        if(number == null) return;
        operand = number * sign;
        sign = 1;
        number = null;
        rawNumber = [];
    }
    else if(number !== null){
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
    if(!rawNumber.length){
        number = null;
        sign = 1;
        flushDisplay();
        return;
    }
    rawNumber.pop();
    number = parseFloat(rawNumber.join(''));
    if(Number.isNaN(number)){
        number = null;
    }
    console.log(number);
    flushDisplay();
}

function handleSign(){
    sign *= -1;
    flushDisplay();
}

const numberButtons = document.querySelectorAll('.numbers');
numberButtons.forEach((currentButton) => {
    currentButton.addEventListener('click', (e) => handleInputNumber(e.target.textContent));
});

const operationButtons = document.querySelectorAll('.operations');
operationButtons.forEach((currentButton) => {
    currentButton.addEventListener('click', (e) => handleOperations(e.target.textContent));
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

const signButton = document.querySelector('#sign');
signButton.addEventListener('click', handleSign);

document.addEventListener("keydown", (event) => {
    console.log(event.key);
    if('0' <= event.key && event.key <= '9'){
        handleInputNumber(event.key);
        return;
    }
    switch (event.key){
        case '/':
            handleOperations('/');
            event.preventDefault();
            break;
        case 'x':
        case '*': 
            handleOperations('x');
            break;
        case '+':
            handleOperations('+');
            break;
        case '-':
            handleOperations('-');
            break;
        case '^':
            handleOperations('^');
            break;
        case 'Backspace':
            handleDelete();
            break;
        case 'c':
            resetValue();
            flushDisplay();
            break;
        case '=':
        case 'Enter':
            handleEqual();
            break;
        case '.':
            handleDecimal();
            break;
    }
})