// Total Ways to Sum
// Total Ways to Sum II

const cache = new Map();

function totalWaysToSum(ns, number, addends) {
    if (number < 0) return 0;
    if (number === 0) return 1;
    const cacheKey = JSON.stringify([number, addends]);
    if (cache.has(cacheKey)) return cache.get(cacheKey)

    let numSums = 0;
    for (let addend of addends) {
        const s = totalWaysToSum(ns, number - addend, addends.filter(a => a <= addend));
        numSums += s;
    }

    ns.print(`N: ${number} A: ${JSON.stringify(addends)} R: ${numSums}`);
    cache.set(cacheKey, numSums);
    return numSums;
}

/** @param {NS} ns */
export async function main(ns) {
    const input = JSON.parse(ns.args[0]);
    const responsePort = ns.args[1];
    ns.print(`Input: ${input}`);

    const number = input[0];
    const addends = input[1];

    const answer = totalWaysToSum(ns, number, addends);
    ns.print(`Ways to sum ${number} is ${answer}`);
    ns.writePort(responsePort, JSON.stringify(answer));
}
