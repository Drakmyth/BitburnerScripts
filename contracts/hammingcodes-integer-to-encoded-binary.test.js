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
        new TestCase(21, '1001101011')
    ];

    for (let [index, test] of testCases.entries()) {
        ns.run(`contracts/hammingcodes-integer-to-encoded-binary.js`, 1, JSON.stringify(test.input), Ports.CONTRACT_TEST_PORT);

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
