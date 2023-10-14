// Array Jumping Game II

import { NS } from "@ns";

export async function main(ns: NS) {
    const input: number[] = JSON.parse(ns.args[0] as string);
    const responsePort = ns.args[1] as number;
    ns.print(`Input: ${JSON.stringify(input)}`);

    const jumps = Array<number>(input.length).fill(-1);
    jumps[jumps.length - 1] = 0;

    for (let i = jumps.length - 2; i >= 0; i--) {
        const candidates = jumps
            .slice(i + 1, i + input[i] + 1)
            .filter((j) => j > -1);
        jumps[i] = candidates.length > 0 ? Math.min(...candidates) + 1 : -1;
    }

    ns.print(`Minimum jumps: ${JSON.stringify(jumps)}`);
    const answer = jumps[0] < 0 ? 0 : jumps[0];
    ns.print(`Answer: ${answer}`);
    ns.writePort(responsePort, JSON.stringify(answer));
}
