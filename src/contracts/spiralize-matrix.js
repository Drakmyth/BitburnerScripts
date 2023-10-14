// Spiralize Matrix

/** @param {import("../../NetscriptDefinitions.d.ts").NS} ns */
function sliceTop(ns, data) {
    const top = data.shift();
    ns.print(`Top: ${JSON.stringify(top)}`);
    return top;
}

/** @param {import("../../NetscriptDefinitions.d.ts").NS} ns */
function sliceRight(ns, data) {
    const right = [];
    for (let i = 0; i < data.length; i++) {
        const row = data[i];
        right.push(row.pop());
        if (row.length < 1) {
            data.shift();
            if (data.length > 0) {
                i--;
            }
        }
    }
    ns.print(`Right: ${JSON.stringify(right)}`);
    return right;
}

/** @param {import("../../NetscriptDefinitions.d.ts").NS} ns */
function sliceBottom(ns, data) {
    const bottom = data.pop();
    bottom.reverse();
    ns.print(`Bottom: ${JSON.stringify(bottom)}`);
    return bottom;
}

/** @param {import("../../NetscriptDefinitions.d.ts").NS} ns */
function sliceLeft(ns, data) {
    const left = [];
    for (let i = data.length - 1; i >= 0; i--) {
        const row = data[i];
        left.push(row.shift());
        if (row.length < 1) {
            data.pop();
        }
    }
    ns.print(`Left: ${JSON.stringify(left)}`);
    return left;
}

/** @param {import("../../NetscriptDefinitions.d.ts").NS} ns */
export async function main(ns) {
    const input = JSON.parse(ns.args[0]);
    const responsePort = ns.args[1];
    ns.print(`Input: ${JSON.stringify(input)}`);

    const spiral = [];
    while (true) {
        spiral.push(...sliceTop(ns, input));
        if (input.length < 1) break;
        spiral.push(...sliceRight(ns, input));
        if (input.length < 1) break;
        spiral.push(...sliceBottom(ns, input));
        if (input.length < 1) break;
        spiral.push(...sliceLeft(ns, input));
        if (input.length < 1) break;
    }

    const spiralStr = JSON.stringify(spiral);
    ns.print(`Unwrapped spiral is ${spiralStr}`);
    ns.writePort(responsePort, spiralStr);
}
