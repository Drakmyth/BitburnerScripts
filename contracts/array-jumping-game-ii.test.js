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
        // Test cases are real contracts I've solved
        new TestCase([2, 0, 0, 1, 3, 0, 0, 3, 2, 5, 5, 3, 2, 0, 0, 6, 3, 0, 3, 2, 5, 1, 1, 3], 0),
        new TestCase([5, 3, 6, 2, 4, 6, 1, 7, 1, 3, 1, 5, 1, 4, 1, 2, 0], 3)
    ];

    for (let [index, test] of testCases.entries()) {
        ns.run(`contracts/array-jumping-game-ii.js`, 1, JSON.stringify(test.input), Ports.CONTRACT_TEST_PORT);

        const port = ns.getPortHandle(Ports.CONTRACT_TEST_PORT);
        while (port.empty()) {
            await ns.sleep(1);
        }

        const response = JSON.parse(port.read());
        const result = response === test.output;
        ns.tprint(`Test ${index + 1}/${testCases.length}: ${result ? `PASS` : `!!!! FAILED !!!!`}`);
        if (!result) {
            ns.tprint(`    Expected: ${JSON.stringify(test.output)}, Received: ${JSON.stringify(response)}`);
        }
    }
}
