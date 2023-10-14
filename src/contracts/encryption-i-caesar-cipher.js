// Encryption I: Caesar Cipher

/** @param {import("../../NetscriptDefinitions.d.ts").NS} ns */
export async function main(ns) {
    const input = JSON.parse(ns.args[0]);
    const responsePort = ns.args[1];
    const str = input[0];
    const shift = input[1];
    ns.print(`Input: ${str}`);
    ns.print(`Shift: ${shift}`);

    let chars = `ABCDEFGHIJKLMNOPQRSTUVWXYZ`;

    const rightShift = chars.length - shift;

    let answer = ``;
    for (let i = 0; i < str.length; i++) {
        const start = chars.indexOf(str[i]);
        if (start < 0) {
            answer += str[i];
            continue;
        }
        const end = (start + rightShift) % chars.length;

        answer += chars[end];
    }

    ns.print(`Input: ${str}, Output: ${answer}`);
    ns.writePort(responsePort, JSON.stringify(answer));
}
