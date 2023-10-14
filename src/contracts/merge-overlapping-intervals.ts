// Merge Overlapping Intervals

import { NS } from "@ns";

export async function main(ns: NS) {
    const input: [number, number][] = JSON.parse(ns.args[0] as string);
    const responsePort = ns.args[1] as number;

    input.sort((a, b) => a[0] - b[0]);
    ns.print(`Input: ${JSON.stringify(input)}`);

    for (let i = 0; i < input.length - 1; i++) {
        const current = input[i];
        const next = input[i + 1];

        if (next[0] >= current[0] && next[0] <= current[1]) {
            input[i][1] = Math.max(current[1], next[1]);
            input.splice(i + 1, 1);
            i--;
        }
    }

    ns.print(`Merged intervals: ${JSON.stringify(input)}`);
    ns.writePort(responsePort, JSON.stringify(input));
}
