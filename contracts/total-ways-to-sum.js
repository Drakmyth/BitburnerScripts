// Total Ways to Sum

/** @param {NS} ns */
export async function main(ns) {
    const input = JSON.parse(ns.args[0]);
    const responsePort = ns.args[1];
    ns.print(`Input: ${input}`);

    // Implementation taken from 
    // https://github.com/phantomesse/bitburner/blob/main/scripts/contracts/total-ways-to-sum.js
    // because I got tired of trying to understand why the summation recurrance relation function
    // wasn't working.

    const waysToSum = new Array(input + 1).fill(0);
    waysToSum[0] = 1;

    for (let i = 1; i < input; i++) {
        for (let j = i; j < input + 1; j++) {
            waysToSum[j] = waysToSum[j] + waysToSum[j - i];
        }
    }

    const answer = waysToSum[input];
    ns.print(`Ways to sum is ${answer}`);
    ns.writePort(responsePort, JSON.stringify(answer));
}
