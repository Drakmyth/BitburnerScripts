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
        new TestCase(785484550, 234473),
        new TestCase(777986532, 2423),
        new TestCase(166934276, 1399),
        new TestCase(129829481, 25847),
        new TestCase(862536428, 16587239),
        new TestCase(1596174, 266029),
        new TestCase(395033078, 17956049)
    ];

    for (let [index, test] of testCases.entries()) {
        ns.run(`contracts/find-largest-prime-factor.js`, 1, JSON.stringify(test.input), Ports.CONTRACT_TEST_PORT);

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
