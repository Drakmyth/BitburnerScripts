// HammingCodes: Encoded Binary to Integer

/** @param {NS} ns */
export async function main(ns) {
    // const input = JSON.parse(ns.args[0]);
    // const responsePort = ns.args[1];
    const input = `110111101001011011100001000011`;
    ns.print(`Input: ${JSON.stringify(input)}`);

    const encoding = input.split(``).map(b => Number.parseInt(b));
    ns.print(`Encoding: ${JSON.stringify(encoding)}`);

    let numParityBits = 0;
    while(Math.pow(2, numParityBits) < encoding.length) {
        numParityBits++;
    }
    ns.print(`numParityBits: ${numParityBits}`);

    const parityBits = [];
    for (let i = 0; i < numParityBits; i++) {
        parityBits.push(Math.pow(2, i));
    }

    ns.print(`ParityBits: ${JSON.stringify(parityBits)}`);

    const matches = [...input.slice(1).matchAll(/1/g)];
    ns.print(matches.length);
    const encodingParity = matches.length % 2;

    if (encodingParity !== encoding[0]) {
        ns.print(`Error exists`);
        // TODO: Fix error
    }

    const data = encoding.filter((_, i) => !parityBits.includes(i) && i !== 0).join(``);
    ns.print(`Data: ${data}`);

    const answer = Number.parseInt(data, 2);
    ns.print(`Answer: ${answer}`);
    // ns.writePort(responsePort, JSON.stringify(answer));
}
