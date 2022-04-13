function data_to_str(data) {
    let str = [];
    for (let pair of data) {
        str.push(`(${pair.join(`, `)})`);
    }
    return `[${str.join(`, `)}]`;
}

/** @param {NS} ns */
export async function main(ns) {
    let input = JSON.parse(ns.args[0]);
    let responsePort = ns.args[1];

    input.sort((a, b) => a[0] - b[0]);
    ns.print(input);

    for (let i = 0; i < input.length - 1; i++) {
        let current = input[i];
        let next = input[i + 1];

        if (next[0] >= current[0] && next[0] <= current[1]) {
            input[i][1] = Math.max(current[1], next[1]);
            input.splice(i + 1, 1);
            i--;
        }
    }

    ns.print(`Merged intervals: ${input}`);
    ns.writePort(responsePort, JSON.stringify(input));
}
