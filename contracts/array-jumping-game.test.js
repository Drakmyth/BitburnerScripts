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
        new TestCase([0, 0, 6, 9, 1, 4, 7, 0, 2, 10, 0, 9, 1, 1, 0, 0, 10, 7, 5, 0, 0], 0),
        new TestCase([0, 5, 1], 0),
        new TestCase([8, 6, 5, 0, 1, 1, 0, 8, 0, 8, 10, 4, 1, 5], 1),
        new TestCase([0, 0, 0, 4, 0, 0, 0, 0, 7], 0),
        new TestCase([5, 2, 6, 0], 1),
        new TestCase([7, 0, 4, 9, 6, 4, 6, 10, 0, 1, 0, 4, 0, 0, 4], 1),
        new TestCase([9, 0, 7, 0, 6, 4, 7, 2], 1),
        new TestCase([7, 8, 1, 0, 4, 8, 10, 9, 8, 10, 8, 8, 9, 6, 7], 1)
    ];

    for (let [index, test] of testCases.entries()) {
        ns.run(`contracts/array-jumping-game.js`, 1, JSON.stringify(test.input), Ports.CONTRACT_TEST_PORT);

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
