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
        new TestCase(4, 4),
        new TestCase(23, 1254),
        new TestCase(70, 4087967),
        new TestCase(34, 12309),
        new TestCase(81, 18004326),
        new TestCase(80, 15796475),
        new TestCase(22, 1001)
    ];

    for (let [index, test] of testCases.entries()) {
        ns.run(`contracts/total-ways-to-sum.js`, 1, JSON.stringify(test.input), Ports.CONTRACT_TEST_PORT);

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
