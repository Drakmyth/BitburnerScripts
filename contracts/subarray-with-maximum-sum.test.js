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
        new TestCase([3, 2, -10, 3, 9, 6, 6, 4, 3, 7, -3, 5, 9, -5, 5, 3, 5, -3, 10, 7, -2, 8, 0, -4, -5, -1, -3, -8, 9, -2, 9, 4, -5, 9, -2, 7], 85),
        new TestCase([5, 10, 2, -6, 8, 6, 4, -8, -7, -3, 6, 7, -9, -1], 29),
        new TestCase([-4, 9, -7, 6, 7, -3, 2, -10, -7, -5, 8, -9, -7, -1, -4, 1, -1], 15),
        new TestCase([5, 2, 1, 0, -2, -6, -4, -1, 0, -7, 7, -7, -5, 5, 2, -6, 7, 10, -6, 6, -7, 1, -5, -9, 3, 5, 0, 8, -3, -5], 18),
        new TestCase([-9, -9, 2, 5, 1, -8, 6, -6, 5, 3], 8),
        new TestCase([4, 2, -9, 1, 2, -5, -6, -9, 10, -8, 8, 4, 0, -9, -8, 10, -2, 4, 6, 3, -3, 1, -9, 1, -5], 21),
        new TestCase([10, -10, -9, -6, 8, 1, 7, 3, 2, 8, -6, 10], 33),
        new TestCase([8, 6, -9, 0, -4, 0, 6, -3, -9, 5, -1, 8, -3, 6, -4, -6, 6, 4, 7, 2], 24),
        new TestCase([8, 9, -4, 8, 1, -8, -9, 4, 8, -7], 22)
    ];

    for (let [index, test] of testCases.entries()) {
        ns.run(`contracts/subarray-with-maximum-sum.js`, 1, JSON.stringify(test.input), Ports.CONTRACT_TEST_PORT);

        let port = ns.getPortHandle(Ports.CONTRACT_TEST_PORT);
        while (port.empty()) {
            await ns.sleep(1);
        }

        let response = JSON.parse(port.read());
        let result = response === test.output;
        ns.tprint(`Test ${index + 1}/${testCases.length}: ${result ? `PASS` : `!!!! FAILED !!!!`}`);
        if (!result) {
            ns.tprint(`    Expected: ${JSON.stringify(test.output)}, Received: ${JSON.stringify(response)}`);
        }
    }
}
