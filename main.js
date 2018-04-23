// this file is not as important as qm.js, this just contains JS that will run the UI

// var values = ['0', '1', '3', '7', '8', '9', '11', '15'];
var values = ['13', '12', '14', '15', '10', '3', '7', '6'];
var max = 16;
var size = 8;
createSelects();

function run() {
    var myNode = document.getElementById("pi");
    clearChildren(myNode);

    var minterms = values.map((num) => numberToBinary(num));
    var table = [];
    for (let i = 0; i < values.length; i++) {
        const num = values[i];
        const bin = minterms[i];
        table.push({ bin, num });
    }
    var primeIm = findPrimeImplicants(table);
    console.log(primeIm);
    console.log(primeIm);
    var b = document.createElement('b');
    b.innerText = "Matched Pairs: Binary Representation... Extracted Essential Prime Implicants ";
    myNode.appendChild(b);
    for (let i = 0; i < primeIm.length; i++) {
        const pi = primeIm[i];
        var piP = document.createElement('p');
        pi.booleanExp = createBooleanCharacters(pi.bin);
        piP.innerHTML = pi.num + `:&nbsp;<i>${pi.bin}</i>... ${pi.booleanExp}`;
        myNode.appendChild(piP);
    }
    var finalBooleanExpression = document.createElement('p');
    finalBooleanExpression.innerHTML = "Minimal boolean expression / reduction is: <b>" + calculateFinalExpression(_.clone(primeIm)) + "</b>";
    myNode.appendChild(finalBooleanExpression);
}

function clearValues() {
    values = _.times(size, _.constant(0));;
    createSelects();
}

function add() {
    if (values.length >= max) {
        return; // no more
    }
    values.push(0);
    size++;
    createSelects();
}

function remove() {
    if (values.length <= 1) {
        return;
    }
    values.pop();
    size--;
    createSelects();
}

function createSelects() {
    var myNode = document.getElementById("MINTERMS");
    clearChildren(myNode);
    var self = this;
    for (let i = 0; i < values.length; i++) {
        const number = values[i];
        let select = document.createElement('select');
        generateOptions(select, number);
        select.onchange = function () {
            self.clearChildren(document.getElementById("pi"));
            self.values[i] = this.value;
            createSelects();
        }
        myNode.appendChild(select);
    }
}

function rando() {
    var myNode = document.getElementById("pi");
    clearChildren(myNode);
    values = [];
    values = random();
    createSelects();
}

// generates a random array where numbers don't repeat
function random() {
    var newArray = [];
    var left = size;
    while (left > 0) {
        var num = Math.floor(Math.random() * max);
        var found = newArray.find((n) => n == num);
        if (found === undefined) {
            newArray.push(num);
            left--;
        }
    }
    return newArray;
}

function numberToBinary(num) {
    var binaryStr = parseInt(num).toString(2);

    while (binaryStr.length < 4) {
        binaryStr = "0" + binaryStr;
    }
    return binaryStr;
}

function binaryToNumber(num) { return parseInt(num, 2) }

function generateOptions(parentSelect, def) {
    var self = this;
    for (let i = 0; i < max; i++) {
        var options = document.createElement("option");
        options.setAttribute('value', i);
        options.innerText = i;
        options.disabled = values.find((v) => v == i) !== undefined;
        if (i == def) { options.setAttribute("selected", "true") }
        parentSelect.appendChild(options);
    }
}

function clearChildren(myNode) {
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
}

function createBooleanCharacters(binaryString) {
    var bin = [...binaryString];
    // lazy way but i know there are 4
    var alp = ['A', 'B', 'C', 'D'];
    var booleanExp = "";
    for (let i = 0; i < bin.length; i++) {
        const element = bin[i];
        if (element === "0") {
            booleanExp += `${alp[i]}'`;
        }
        else if (element === "1") {
            booleanExp += `${alp[i]}`;
        } else {
            booleanExp += "";
        }
    }
    return booleanExp;
}

// just some array manipulation
function calculateFinalExpression(primeImObj) {
    var numberArray = [];
    var result = {};
    for (let i = 0; i < primeImObj.length; i++) {
        const element = primeImObj[i];
        element.num = isNaN(element.num) ? element.num.replace(/\s+/g, "") : "" + element.num;
        element.num = element.num.split(",").map(Number).sort((a, b) => a - b);
        numberArray.push(element);
    }
    var grid = {}
    for (let m = 0; m < primeImObj.length; m++) {
        for (let j = 0; j < primeImObj[m].num.length; j++) {
            if (!grid[`${primeImObj[m].num[j]}`]) {
                grid[`${primeImObj[m].num[j]}`] = {
                    count: 1,
                    contains: [primeImObj[m].booleanExp],
                };
            } else {
                grid[`${primeImObj[m].num[j]}`].count++;
                grid[`${primeImObj[m].num[j]}`].contains.push(primeImObj[m].booleanExp);
            }
        }
    }
    grid = _.filter(grid, (o) => {
        return o.count <= 1
    });
    // we have the expression, but there are duplicates, do our object trick again.
    var expressionObj = {};
    for (const key in grid) {
        if (grid.hasOwnProperty(key)) {
            if (!expressionObj[`${grid[key].contains[0]}`]) {
                expressionObj[`${grid[key].contains[0]}`] = null;
            }

        }
    }
    let strExpression = "";
    const length = _.size(expressionObj);
    let iterator = 0;
    for (const key in expressionObj) {
        strExpression += (iterator == length - 1 ? key : key + " + ");
        iterator++;
    }
    return strExpression;
}