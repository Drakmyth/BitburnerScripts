class Transaction {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }

    canGrowLeft() {
        return this.start > 0;
    }

    canGrowRight(data) {
        return this.end < data.length - 1;
    }

    copy() {
        return new Transaction(this.start, this.end);
    }

    growLeft() {
        return new Transaction(this.start - 2, this.end);
    }

    growRight() {
        return new Transaction(this.start, this.end + 2);
    }
}

class Timeline {
    constructor(data) {
        this.data = this.preprocess(data)
    }

    preprocess(input) {
        let data = Array.from(input);
    
        // trim beginning
        while (data.length > 1 && data[1] < data[0]) {
            data.shift();
        }
    
        // trim end
        while (data.length > 1 && data[data.length - 1] < data[data.length - 2]) {
            data.pop();
        }
    
        for (let i = 0; i < data.length - 1; i++) {
            // remove adjacent duplicates
            if (data[i] === data[i + 1]) {
                data.splice(i, 1);
                i--;
                continue;
            }
    
            // remove run centers
            if (i < data.length - 2) {
                let c1 = Math.sign(data[i + 1] - data[i]);
                let c2 = Math.sign(data[i + 2] - data[i + 1]);
                if (c1 === c2) {
                    data.splice(i + 1, 1);
                    i--;
                    continue;
                }
            }
        }
    
        return data;
    }

    /** @param {NS} ns */
    calculate_profit() {
        let deltas = [];
        for (let i = 0; i < this.data.length - 1; i++) {
            deltas.push(this.data[i + 1] - this.data[i]);
        }

        let maximumDelta = Math.max(...deltas);
        let maximumDeltaIndex = deltas.indexOf(maximumDelta);
        let transaction = new Transaction(maximumDeltaIndex, maximumDeltaIndex + 1);

        transaction = this.grow_transaction(transaction);
        return this.transact(transaction);
    }

    transact(transaction) {
        let profit = 0;
        for (let i = transaction.start; i < transaction.end; i++) {
            profit += this.data[i + 1] - this.data[i];
        }
        return profit;
    }

    grow_transaction(transaction) {
        let grown = transaction.copy();
        while (grown.canGrowLeft())
        {
            let left = grown.growLeft();
            if (this.transact(left) >= this.transact(grown)) {
                grown = left;
            } else {
                break;
            }
        }

        while (grown.canGrowRight(this.data)) {
            let right = grown.growRight();
            if (this.transact(right) >= this.transact(grown)) {
                grown = right;
            } else {
                break;
            }
        }

        return grown;
    }
}

/** @param {NS} ns */
export async function main(ns) {
    let host = ns.args[0];
    let contract = ns.args[1];
    let data = ns.codingcontract.getData(contract, host);
    let timeline = new Timeline(data);
    let profit =  timeline.calculate_profit();

    let result = ns.codingcontract.attempt(profit, contract, host, { returnReward: true });
    let success = result !== "";
    let msg = !success ? "Incorrect answer: " + profit : result;
    let variant = success ? "success": "error";
    ns.toast(msg, variant, 5000);
}
