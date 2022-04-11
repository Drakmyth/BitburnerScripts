/** @param {NS} ns */
export async function main(ns) {
    let host = ns.args[0];
    let contract = ns.args[1];
    let data = ns.codingcontract.getData(contract, host);

    ns.print(data);
    
    let sums = [data[0]];
    for (let row = 1; row < data.length; row++) {
        let rowSums = []
        for (let i = 0; i < data[row].length; i++) {
            let current = data[row][i];
            if (i === 0) {
                rowSums.push(sums[row-1][i] + current);
                continue;
            }
            if (i === data[row].length - 1) {
                rowSums.push(sums[row-1][i-1] + current);
                continue;
            }

            let left = sums[row-1][i-1];
            let right = sums[row-1][i];
            rowSums.push(Math.min(left, right) + current);
        }
        sums.push(rowSums);
    }

    let smallestSum = Math.min(...sums[sums.length - 1]);

    let result = ns.codingcontract.attempt(smallestSum, contract, host, { returnReward: true })
    let success = result !== "";
    let msg = !success ? "Incorrect answer: " + smallestSum : result;
    let variant = success ? "success": "error";
    ns.toast(msg, variant, 5000);
}
