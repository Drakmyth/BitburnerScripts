// Subarray with Maximum Sum

import { NS } from "@ns";

export async function main(ns: NS) {
    const input: number[] = JSON.parse(ns.args[0] as string);
    const responsePort = ns.args[1] as number;
    ns.print(`Input: ${JSON.stringify(input)}`);

    const data = input.filter((i) => i !== 0);

    for (let i = 0; i < data.length - 1; i++) {
        if (Math.sign(data[i]) === Math.sign(data[i + 1])) {
            data[i] += data[i + 1];
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
        for (let j = i; j < data.length; j += 2) {
            let sum = data
                .slice(i, j + 1)
                .reduce((total, current) => total + current, 0);
            if (sum > biggestSum) {
                biggestSum = sum;
                ns.print(`Found bigger sum: ${biggestSum} at [${i}, ${j}]`);
            }
        }
    }

    ns.print(`Maximum profit is ${biggestSum}`);
    ns.writePort(responsePort, JSON.stringify(biggestSum));
}
