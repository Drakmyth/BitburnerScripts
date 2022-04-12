function preprocess(data) {
    return data.map(d => [d, false]);
}

/** @param {NS} ns */
export async function main(ns) {
    let host = ns.args[0];
    let contract = ns.args[1];
    let data = preprocess(ns.codingcontract.getData(contract, host));
    data[data.length - 1][1] = true;

    for (let i = data.length - 1; i >= 0; i--) {
        if (data[i][1]) continue;

        if (i + data[i][0] >= data.length - 1) {
            data[i][1] = true;
            continue;
        }

        let candidates = data.slice(i, i + data[i][0] + 1);
        if (candidates.some(d => d[1])) {
            data[i][1] = true;
        }
    }

    let canWin = data[0][1] ? 1 : 0
    let result = ns.codingcontract.attempt(canWin, contract, host, { returnReward: true });
    let success = result !== "";
    let msg = !success ? "Incorrect answer: " + canWin : result;
    let variant = success ? "success": "error";
    ns.toast(msg, variant, 5000);
}
