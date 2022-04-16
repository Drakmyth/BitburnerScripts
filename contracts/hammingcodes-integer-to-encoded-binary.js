// HammingCodes: Integer to encoded Binary

/** @param {NS} ns */
export async function main(ns) {
    let input = JSON.parse(ns.args[0]);
    let responsePort = ns.args[1];
    ns.print(`Input: ${JSON.stringify(input)}`);

    let data = input.toString(2).split(``).map(b => Number.parseInt(b));
    ns.print(`Data: ${JSON.stringify(data)}`);

    
    let numParityBits = 0;
    while(Math.pow(2, numParityBits) < numParityBits + data.length + 1) {
        numParityBits++;
    }
    ns.print(`numParityBits: ${numParityBits}`);
    let encoding = new Array(numParityBits + data.length + 1).fill(0);
    let parityBits = [];
    for (let i = 1; i < encoding.length; i++) {
        let pow = Math.log2(i);
        if (pow - Math.floor(pow) === 0) {
            parityBits.push(i);
            continue;
        }

        encoding[i] = data.shift();
    }

    ns.print(`ParityBits: ${JSON.stringify(parityBits)}`)

    let parity = encoding.reduce((total, bit, index) => total ^= bit > 0 ? index : 0, 0);
    let parityVals = parity.toString(2).split(``).map(b => Number.parseInt(b)).reverse();
    while(parityVals.length < parityBits.length) {
        parityVals.push(0);
    }

    for (let i = 0; i < parityBits.length; i++) {
        encoding[parityBits[i]] = parityVals[i];
    }
    ns.print(`Parity: ${JSON.stringify(parityVals)}`);

    let globalParity = (encoding.toString().split(`1`).length - 1) % 2 === 0 ? 0 : 1;
    ns.print(`GlobalParity: ${globalParity}`);
    encoding[0] = globalParity;

    ns.print(`Encoding: ${JSON.stringify(encoding)}`);

    let answer = encoding.reduce((total, bit) => total += bit, ``);
    ns.print(`Answer: ${answer}`);
    ns.writePort(responsePort, JSON.stringify(answer));
}
