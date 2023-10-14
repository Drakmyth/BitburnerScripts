// Algorithmic Stock Trader I
// Algorithmic Stock Trader II
// Algorithmic Stock Trader III
// Algorithmic Stock Trader IV

/** @param {import("../../NetscriptDefinitions.d.ts").NS} ns */
export async function main(ns) {
    const input = JSON.parse(ns.args[0]);
    const responsePort = ns.args[1];
    ns.print(`Input: ${JSON.stringify(input)}`);

    // Adapted from
    // https://github.com/devmount/bitburner-contract-solver/blob/bbade7eb9bb0bda329ba1961c31c29f8c3defae8/app.js#L235
    // because although I figured out AST II okay, the other 3 (and especially IV) kicked my butt

    const maxTransactions = input[0];
    const prices = input[1];

    if (prices.length < 2) {
        ns.print(`Not enough prices to transact. Maximum profit is 0.`);
        ns.writePort(responsePort, 0);
        return;
    }

    if (maxTransactions > prices.length / 2) {
        // Is this valid if the input array hasn't been optimized?
        let sum = 0;
        for (let day = 1; day < prices.length; day++) {
            sum += Math.max(prices[day] - prices[day - 1], 0);
        }
        ns.print(
            `More transactions available than can be used. Maximum profit is ${sum}.`
        );
        ns.writePort(responsePort, sum);
        return;
    }

    const rele = Array(maxTransactions + 1).fill(0);
    const hold = Array(maxTransactions + 1).fill(Number.MIN_SAFE_INTEGER);

    for (let day = 0; day < prices.length; day++) {
        const price = prices[day];
        for (let i = maxTransactions; i > 0; i--) {
            rele[i] = Math.max(rele[i], hold[i] + price);
            hold[i] = Math.max(hold[i], rele[i - 1] - price);
        }
    }

    const profit = rele[maxTransactions];
    ns.print(`Maximum profit is ${profit}`);
    ns.writePort(responsePort, JSON.stringify(profit));
}
