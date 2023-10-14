// Compression I: RLE Compression

/** @param {NS} ns */
export async function main(ns) {
    const input = JSON.parse(ns.args[0]);
    const responsePort = ns.args[1];
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
