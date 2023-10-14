// Compression I: RLE Compression

import { NS } from "@ns";

export async function main(ns: NS) {
    const input: string = JSON.parse(ns.args[0] as string);
    const responsePort = ns.args[1] as number;
    ns.print(`Input: ${input}`);

    let answer = ``;
    for (let i = 0; i < input.length; i) {
        let char = input[i];
        let count = 1;
        while (
            i + count < input.length &&
            count < 9 &&
            input[i + count] == char
        ) {
            count++;
        }

        answer += `${count}${char}`;
        i += count;
    }

    ns.print(`Output: ${answer}`);
    ns.writePort(responsePort, JSON.stringify(answer));
}
