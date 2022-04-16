// Minimum Path Sum in a Triangle

/** @param {NS} ns */
export async function main(ns) {
    const input = JSON.parse(ns.args[0]);
    const responsePort = ns.args[1];
    ns.print(`Input ${JSON.stringify(input)}`);
    
    const sums = [input[0]];
    for (let row = 1; row < input.length; row++) {
        const rowSums = []
        for (let i = 0; i < input[row].length; i++) {
            const current = input[row][i];
            if (i === 0) {
                rowSums.push(sums[row-1][i] + current);
                continue;
            }
            if (i === input[row].length - 1) {
                rowSums.push(sums[row-1][i-1] + current);
                continue;
            }

            const left = sums[row-1][i-1];
            const right = sums[row-1][i];
            rowSums.push(Math.min(left, right) + current);
        }
        sums.push(rowSums);
    }

    const smallestSum = Math.min(...sums[sums.length - 1]);
    ns.print(`Smallest sum is ${smallestSum}`);
    ns.writePort(responsePort, JSON.stringify(smallestSum));
}
