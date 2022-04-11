/** @param {NS} ns */
export async function main(ns) {
    let host = ns.args[0];
    let contract = ns.args[1];
    let data = ns.codingcontract.getData(contract, host);
    
    data = data.filter(i => i !== 0);
    
    for (let i = 0; i < data.length - 1; i++) {
        if (Math.sign(data[i]) === Math.sign(data[i+1])) {
            data[i] += data[i+1];
            data.splice(i + 1, 1);
            i--;
        }
    }

    if (Math.sign(data[0]) < 0) {
        data.shift();
    }

    if (Math.sign(data[data.length - 1]) < 0) {
        data.pop();
    }


    let biggestSum = 0;
    for (let i = 0; i < data.length; i++) {
        for (let j = i; j < data.length; j+=2) {
            let sum = data.slice(i, j+1).reduce((total, current) => total + current, 0);
            if (sum > biggestSum) {
                biggestSum = sum;
                ns.print("Found bigger sum: " + biggestSum + " at [" + i + ", " + j + "]");
            }
        }
    }

    let result = ns.codingcontract.attempt(biggestSum, contract, host, { returnReward: true })
    let success = result !== "";
    let msg = !success ? "Incorrect answer: " + biggestSum : result;
    let variant = success ? "success": "error";
    ns.toast(msg, variant, 5000);
}
