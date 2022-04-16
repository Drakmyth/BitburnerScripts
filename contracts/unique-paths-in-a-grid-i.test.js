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
        new TestCase([7, 11], 8008),
        new TestCase([10, 5], 715),
        new TestCase([14, 10], 497420),
        new TestCase([10, 2], 10),
        new TestCase([2, 14], 14),
        new TestCase([3, 9], 45),
        new TestCase([4, 13], 455)
    ];

    for (let [index, test] of testCases.entries()) {
        ns.run(`contracts/unique-paths-in-a-grid-i.js`, 1, JSON.stringify(test.input), Ports.CONTRACT_TEST_PORT);

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
