// HammingCodes: Integer to encoded Binary

import { NS } from "@ns";

export async function main(ns: NS) {
    const input: number = JSON.parse(ns.args[0] as string); // I think parse actually returns a string here
    const responsePort = ns.args[1] as number;
    ns.print(`Input: ${JSON.stringify(input)}`);

    const data = input
        .toString(2)
        .split(``)
        .map((b) => Number.parseInt(b));
    ns.print(`Data: ${JSON.stringify(data)}`);

    let numParityBits = 0;
    while (Math.pow(2, numParityBits) < numParityBits + data.length + 1) {
        numParityBits++;
    }
    ns.print(`numParityBits: ${numParityBits}`);
    const encoding = Array<number>(numParityBits + data.length + 1).fill(0);
    const parityBits: number[] = [];
    // TODO: populate parityBits with 2^x for x in range 0 to (numParityBits - 1), then
    //       the below calcualtion go away in favor of `if (i in parityBits) continue;
    for (let i = 1; i < encoding.length; i++) {
        const pow = Math.log2(i);
        if (pow - Math.floor(pow) === 0) {
            parityBits.push(i);
            continue;
        }

        encoding[i] = data.shift() as number;
    }

    ns.print(`ParityBits: ${JSON.stringify(parityBits)}`);

    const parity = encoding.reduce(
        (total, bit, index) => (total ^= bit > 0 ? index : 0),
        0
    );
    const parityVals = parity
        .toString(2)
        .split(``)
        .map((b) => Number.parseInt(b))
        .reverse();
    while (parityVals.length < parityBits.length) {
        parityVals.push(0);
    }

    for (let i = 0; i < parityBits.length; i++) {
        encoding[parityBits[i]] = parityVals[i];
    }
    ns.print(`Parity: ${JSON.stringify(parityVals)}`);

    const globalParity =
        (encoding.toString().split(`1`).length - 1) % 2 === 0 ? 0 : 1;
    ns.print(`GlobalParity: ${globalParity}`);
    encoding[0] = globalParity;

    ns.print(`Encoding: ${JSON.stringify(encoding)}`);

    const answer = encoding.reduce((total, bit) => (total += bit), ``);
    ns.print(`Answer: ${answer}`);
    ns.writePort(responsePort, JSON.stringify(answer));
}
