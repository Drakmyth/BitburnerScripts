/** @param {NS} ns */
function sliceTop(ns, data) {
    let top = data.shift();
    ns.print(`Top: ${JSON.stringify(top)}`);
    return top;
}

/** @param {NS} ns */
function sliceRight(ns, data) {
    let right = [];
    for (let i = 0; i < data.length; i++) {
        let row = data[i];
        right.push(row.pop());
        if (row.length < 1) {
            data.shift();
            if (data.length > 0) {
                i--;
            }
        }
    };
    ns.print(`Right: ${JSON.stringify(right)}`);
    return right;
}

/** @param {NS} ns */
function sliceBottom(ns, data) {
    let bottom = data.pop();
    bottom.reverse();
    ns.print(`Bottom: ${JSON.stringify(bottom)}`);
    return bottom;
}

/** @param {NS} ns */
function sliceLeft(ns, data) {
    let left = [];
    for (let i = data.length - 1; i >= 0; i--) {
        let row = data[i];
        left.push(row.shift());
        if (row.length < 1) {
            data.pop();
        }
    }
    ns.print(`Left: ${JSON.stringify(left)}`);
    return left;
}

/** @param {NS} ns */
export async function main(ns) {
    let input = JSON.parse(ns.args[0]);
    let responsePort = ns.args[1];
    ns.print(input);

    let spiral = [];
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

    let spiralStr = JSON.stringify(spiral);
    ns.print(`Unwrapped spiral is ${spiralStr}`);
    ns.writePort(responsePort, spiralStr);
}
