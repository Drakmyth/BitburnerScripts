class Day {
    // action 0 = hold, 1 = buy, -1 = sell
    constructor(price, action = 0) {
        this.price = price;
        this.action = action;
    }
}

class Timeline {
    constructor(data) {
        this.data = data.map(d => new Day(d, 0));
        this.determine_buys();
        this.determine_sells_and_holds();
    }

    determine_buys() {
        for (let i = this.data.length - 2; i >= 0; i--) {
            let current = this.data[i];
            let next = this.data[i + 1];
            if (next.price < current.price) continue;

            if (i > 0) {
                let previous = this.data[i - 1];
                if (previous.price < current.price) continue;
            }

            this.data[i].action = 1;
        }
    }

    determine_sells_and_holds() {
        let bought = false;
        for (let i = 0; i < this.data.length; i++) {
            let current = this.data[i];
            if (current.action === 1 && !bought) {
                bought = true;
                continue;
            }
            if (!bought) continue;
            if (i === this.data.length - 1 && bought) {
                this.data[i].action = -1;
                bought = false;
                continue;
            }
            let next = this.data[i + 1];
            if (next.price < current.price) {
                this.data[i].action = -1;
                bought = false;
            }
        }
    }

    calculate_profit() {
        let profit = 0;
        let start = -1;
        for (let [index, day] of this.data.entries()) {
            if (day.action === 0) continue;
            if (day.action === 1) {
                start = index;
            }
            if (day.action === -1) {
                profit += day.price - this.data[start].price;
            }
        }

        return profit;
    }
}

/** @param {NS} ns */
export async function main(ns) {
    let host = ns.args[0];
    let contract = ns.args[1];
    let timeline = new Timeline(ns.codingcontract.getData(contract, host));
    let profit =  timeline.calculate_profit();

    let result = ns.codingcontract.attempt(profit, contract, host, { returnReward: true });
    let success = result !== "";
    let msg = !success ? "Incorrect answer: " + profit : result;
    let variant = success ? "success": "error";
    ns.toast(msg, variant, 5000);
}
