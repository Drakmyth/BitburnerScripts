// HammingCodes: Encoded Binary to Integer

/** @param {NS} ns */
export async function main(ns) {
    const input = JSON.parse(ns.args[0]);
    const responsePort = ns.args[1];
    let encoding = input;
    ns.print(`Input: ${JSON.stringify(input)}`);

    const max_exponent = Math.floor(Math.log(input.length) / Math.log(2))
    let parityBits = [0];
    for (let i = 0; i < max_exponent; i++) {
        const parityBit = Math.pow(2, i);
        parityBits.push(parityBit);
    }

    ns.print(`ParityBits: ${JSON.stringify(parityBits)}`);

    const ones = [...input.matchAll(/1/g)];
    const error = ones.map(m => m.index).reduce((xor, i) => xor ^ i);
    if (error > 0) {
        ns.print(`Error detected at position: ${error}`);
        const bit = input.charAt(error) === `0` ? `1` : `0`;
        encoding = input.substring(0, error) + bit + input.substring(error + 1);
    }

    for (let i = parityBits.length - 1; i >= 0; i--) {
        const bit = parityBits[i];
        encoding = encoding.substring(0, bit) + encoding.substring(bit + 1);
    }
    ns.print(`Decoded: ${encoding}`);

    const answer = Number.parseInt(encoding, 2);
    ns.print(`Answer: ${answer}`);
    ns.writePort(responsePort, JSON.stringify(answer));
}
