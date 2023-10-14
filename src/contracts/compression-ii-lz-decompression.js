// Compression II: LZ Decompression

/** @param {import("../../NetscriptDefinitions.d.ts").NS} ns */
export async function main(ns) {
    const input = JSON.parse(ns.args[0]);
    const responsePort = ns.args[1];
    ns.print(`Input: ${input}`);

    let answer = ``;

    let i = 0;
    while (i < input.length) {
        // type 1
        let length = parseInt(input[i]);
        i++;
        if (length > 0) {
            let data = input.substring(i, i + length);
            answer += data;
            i += length;
        }

        if (i >= input.length) break;

        // type 2
        length = parseInt(input[i]);
        i++;
        if (length > 0) {
            let offset = parseInt(input[i]);
            i++;

            for (let j = 0; j < length; j++) {
                answer += answer[answer.length - offset];
            }
        }
    }

    ns.print(`Output: ${answer}`);
    ns.writePort(responsePort, JSON.stringify(answer));
}
