/** @param {NS} ns */
export async function main(ns) {
    let input = JSON.parse(ns.args[0]);
    let responsePort = ns.args[1];
    ns.print(input);
    
    let sums = [input[0]];
    for (let row = 1; row < input.length; row++) {
        let rowSums = []
        for (let i = 0; i < input[row].length; i++) {
            let current = input[row][i];
            if (i === 0) {
                rowSums.push(sums[row-1][i] + current);
                continue;
            }
            if (i === input[row].length - 1) {
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
    ns.print(`Smallest sum is ${smallestSum}`);
    ns.writePort(responsePort, smallestSum);
}
