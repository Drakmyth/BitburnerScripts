// Total Ways to Sum
// Total Ways to Sum II

import { NS } from "@ns";

function totalWaysToSum(
    ns: NS,
    number: number,
    addends: number[],
    cache: Map<string, number>
) {
    if (number < 0) return 0;
    if (number === 0) return 1;
    const cacheKey = JSON.stringify([number, addends]);
    if (cache.has(cacheKey)) return cache.get(cacheKey) as number;

    let numSums = 0;
    for (let addend of addends) {
        const s = totalWaysToSum(
            ns,
            number - addend,
            addends.filter((a) => a <= addend),
            cache
        );
        numSums += s;
    }

    ns.print(`N: ${number} A: ${JSON.stringify(addends)} R: ${numSums}`);
    cache.set(cacheKey, numSums);
    return numSums;
}

export async function main(ns: NS) {
    const cache = new Map<string, number>();
    const input: [number, number[]] = JSON.parse(ns.args[0] as string);
    const responsePort = ns.args[1] as number;
    ns.print(`Input: ${input}`);

    const number = input[0];
    const addends = input[1];

    const answer = totalWaysToSum(ns, number, addends, cache);
    ns.print(`Ways to sum ${number} is ${answer}`);
    ns.writePort(responsePort, JSON.stringify(answer));
}
