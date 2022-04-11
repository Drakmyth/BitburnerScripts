function data_to_str(data) {
    let str = [];
    for (let pair of data) {
        str.push("(" + pair.join(", ") + ")");
    }
    return "[" + str.join(", ") + "]";
}

/** @param {NS} ns */
export async function main(ns) {
    let host = ns.args[0];
    let contract = ns.args[1];

    let data = ns.codingcontract.getData(contract, host);
    data.sort((a, b) => a[0] - b[0]);

    for (let i = 0; i < data.length - 1; i++) {
        let current = data[i];
        let next = data[i + 1];

        if (next[0] >= current[0] && next[0] <= current[1]) {
            data[i][1] = Math.max(current[1], next[1]);
            data.splice(i + 1, 1);
            i--;
        }
    }

    let result = ns.codingcontract.attempt(data, contract, host, { returnReward: true })
    let success = result !== "";
    let msg = !success ? "Incorrect answer: " + data_to_str(data) : result;
    let variant = success ? "success": "error";
    ns.toast(msg, variant, 5000);
}
