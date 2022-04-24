import * as Ports from "ports.lib.js";

class TestCase {
    constructor(input, output) {
        this.input = input;
        this.output = output;
    }
}

function generateAddends(number) {
    const addends = [...Array(number).keys()];
    addends.shift(); // Remove 0
    return addends;
}

/** @param {NS} ns */
export async function main(ns) {
    const testCases = [
        // Total Ways to Sum
        new TestCase([4, generateAddends(4)], 4),
        new TestCase([23, generateAddends(23)], 1254),
        new TestCase([70, generateAddends(70)], 4087967),
        new TestCase([34, generateAddends(34)], 12309),
        new TestCase([81, generateAddends(81)], 18004326),
        new TestCase([80, generateAddends(80)], 15796475),
        new TestCase([22, generateAddends(22)], 1001),

        // Total Ways to Sum II - Test cases courtesy of @Wizard on the Bitburner Discord
        new TestCase([140, [1, 2, 4, 10, 11, 12, 13, 15, 18]], 778473),
        new TestCase([39, [1, 3, 4, 7, 8, 10, 12, 15, 16, 17, 18, 19]], 1401),
        new TestCase([156, [1, 3, 4, 6, 7, 9, 10, 11]], 2523836),
        new TestCase([83, [1, 2, 3, 4, 5, 6, 7, 8]], 509267),
        new TestCase([133, [2, 6, 7, 9, 10, 11, 13, 19, 21, 23, 24, 28]], 154707),
        new TestCase([103, [1, 2, 3, 4, 5, 6, 8, 9]], 1497186),
        new TestCase([118, [1, 2, 4, 5, 6, 7, 8, 11, 13, 14, 19, 20]], 8100111),
        new TestCase([161, [1, 4, 5, 6, 7, 9, 11, 12, 16]], 3302570),
        new TestCase([19, [3, 4, 6, 8, 12, 13, 14, 16]], 10)
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
