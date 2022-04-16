import * as Ports from "ports.lib.js";

class TestCase {
    constructor(input, output) {
        this.input = input;
        this.output = output;
    }
}

/** @param {NS} ns */
export async function main(ns) {
    const testCases = [
        new TestCase([[1, 10], [2, 5], [11, 17], [11, 17], [14, 23], [23, 33], [24, 29]], [[1, 10], [11, 33]]),
        new TestCase([[1, 11], [5, 13], [11, 17], [12, 22], [14, 19], [15, 16]], [[1, 22]]),
        new TestCase([[3, 13], [6, 16], [8, 13], [9, 11], [9, 12], [9, 18], [13, 17], [13, 21], [16, 19], [16, 26], [17, 24], [17, 27], [23, 27], [23, 30], [24, 30], [25, 28]], [[3, 30]]),
        new TestCase([[1, 7], [5, 11], [6, 11], [6, 11], [6, 16], [13, 17], [15, 25], [16, 25], [17, 22], [17, 25], [20, 21], [21, 29]], [[1, 29]]),
        new TestCase([[2, 11], [4, 14], [5, 15], [7, 8], [11, 16], [16, 22], [16, 26], [17, 19], [17, 26], [19, 20], [19, 23], [20, 22], [20, 27], [21, 25], [22, 25], [23, 25]], [[2, 27]]),
        new TestCase([[2, 7], [6, 10], [8, 9], [10, 19], [13, 18], [15, 17], [19, 29], [21, 23], [23, 29]], [[2, 29]]),
        new TestCase([[3, 9], [5, 6], [13, 22], [16, 26], [18, 28], [23, 28], [25, 33]], [[3, 9], [13, 33]]),
        new TestCase([[2, 12], [7, 8], [7, 15], [7, 16], [9, 12], [10, 17], [12, 16], [12, 20], [14, 20], [16, 24], [19, 28], [20, 28], [24, 33], [25, 29], [25, 34]], [[2, 34]]),
        new TestCase([[1, 7], [5, 10], [6, 8], [6, 14], [11, 17], [13, 16], [13, 19], [17, 27], [19, 26], [20, 21]], [[1, 27]]),
        new TestCase([[2, 11], [3, 7], [3, 9], [3, 10], [5, 10], [13, 16], [14, 17], [14, 21], [15, 20], [20, 22], [21, 29], [22, 28], [23, 25], [23, 29], [25, 29]], [[2, 11], [13, 29]])
    ];

    for (let [index, test] of testCases.entries()) {
        ns.run(`contracts/merge-overlapping-intervals.js`, 1, JSON.stringify(test.input), Ports.CONTRACT_TEST_PORT);

        const port = ns.getPortHandle(Ports.CONTRACT_TEST_PORT);
        while (port.empty()) {
            await ns.sleep(1);
        }

        const response = JSON.parse(port.read());
        const result = response.every((val, i) => val[0] === test.output[i][0] && val[1] === test.output[i][1]);
        ns.tprint(`Test ${index + 1}/${testCases.length}: ${result ? `PASS` : `!!!! FAILED !!!!`}`);
        if (!result) {
            ns.tprint(`    Expected: ${JSON.stringify(test.output)}, Received: ${JSON.stringify(response)}`);
        }
    }
}
