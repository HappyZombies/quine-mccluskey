// the main code that will run the qm algorithm

function findPrimeImplicants(data) {
    const size = data.length;
    let IM = [];
    let im = [];
    let im2 = [];
    let mark = repeatElement(0, size);
    let mark2;
    let iteration = 0;

    for (let i = 0; i < size; i++) {
        for (let j = i + 1; j < size; j++) {
            const comparedAgainst = data[i];
            const comparedAgainst2 = data[j];
            const c = compareMidterms(data[i].bin, data[j].bin);
            if (c !== "") {
                const content = {
                    bin: c,
                    num: comparedAgainst.num.toString() + ", " + comparedAgainst2.num.toString()
                }
                im.push(content);
                mark[i] = 1;
                mark[j] = 1;
            }
        }
    }
    mark2 = repeatElement(0, im.length);
    for (let i = 0; i < im.length; i++) {
        for (let j = i + 1; j < im.length; j++) {
            if (i !== j && mark2[j] === 0 && im[i].bin === im[j].bin) {
                mark2[j] = 1;
            }
        }
    }

    for (let i = 0; i < im.length; i++) {
        if (mark2[i] === 0) {
            im2.push(im[i]);
        }
    }

    for (let i = 0; i < size; i++) {
        if (mark[i] === 0) {
            IM.push(data[i]);
            iteration = iteration + 1;
        }
    }

    if (iteration !== size && size !== 1) {
        IM = IM.concat(findPrimeImplicants(im2));
    }
    return IM;
}

function repeatElement(element, count) {
    var account = [];
    function addOneAndRecursive(remain) {
        account.push(element);
        if (remain > 1) {
            addOneAndRecursive(remain - 1);
        }
    }
    addOneAndRecursive(count);
    return account;
}

// the main method that will compare the values and see if there is a difference.
function compareMidterms(a, b) {
    var size = a.length;
    var result = '';
    var iteration = 0;
    var tempA = a.split("");
    var tempB = b.split("");
    for (let i = 0; i < size; i++) {
        if (a[i] === b[i]) {
            result += a[i];
        } else {
            result += "-";
            iteration += 1;
        }
    }
    if (iteration > 1) {
        return "";
    }
    return result;
}
