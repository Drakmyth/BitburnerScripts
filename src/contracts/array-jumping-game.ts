// Array Jumping Game

import { NS } from "@ns";

export async function main(ns: NS) {
    const input: number[] = JSON.parse(ns.args[0] as string);
    const responsePort = ns.args[1] as number;
    ns.print(`Input: ${JSON.stringify(input)}`);

    const data: [number, boolean][] = input.map((d) => [d, false]);
    data[data.length - 1][1] = true;

    for (let i = data.length - 1; i >= 0; i--) {
        if (data[i][1]) continue;

        if (i + data[i][0] >= data.length - 1) {
            data[i][1] = true;
            continue;
        }

        const candidates = data.slice(i, i + data[i][0] + 1);
        if (candidates.some((d) => d[1])) {
            data[i][1] = true;
        }
    }

    const answer = data[0][1] ? 1 : 0;
    ns.print(`Answer: ${answer}`);
    ns.writePort(responsePort, JSON.stringify(answer));
}
