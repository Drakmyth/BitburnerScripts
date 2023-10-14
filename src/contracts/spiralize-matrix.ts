// Spiralize Matrix

import { NS } from "@ns";

function sliceTop(ns: NS, data: number[][]) {
    const top = data.shift() as number[];
    ns.print(`Top: ${JSON.stringify(top)}`);
    return top;
}

function sliceRight(ns: NS, data: number[][]) {
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

function sliceBottom(ns: NS, data: number[][]) {
    const bottom = data.pop() as number[];
    bottom.reverse();
    ns.print(`Bottom: ${JSON.stringify(bottom)}`);
    return bottom;
}

function sliceLeft(ns: NS, data: number[][]) {
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

export async function main(ns: NS) {
    const input: number[][] = JSON.parse(ns.args[0] as string);
    const responsePort = ns.args[1] as number;
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
