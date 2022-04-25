import * as Ports from "ports.lib.js";

class TestCase {
    constructor(input, output) {
        this.input = input;
        this.output = output;
    }
}

function generateGrid(input) {
    const rows = input[0];
    const cols = input[1];

    return Array(rows).fill(null).map(() => Array(cols).fill(0));
}

/** @param {NS} ns */
export async function main(ns) {
    const testCases = [
        // Unique Paths in a Grid
        new TestCase(generateGrid([7, 11]), 8008),
        new TestCase(generateGrid([10, 5]), 715),
        new TestCase(generateGrid([14, 10]), 497420),
        new TestCase(generateGrid([10, 2]), 10),
        new TestCase(generateGrid([2, 14]), 14),
        new TestCase(generateGrid([3, 9]), 45),
        new TestCase(generateGrid([4, 13]), 455),

        // Unique Paths in a Grid II
        new TestCase([
            [0, 0, 0],
            [0, 0, 0],
            [1, 0, 0],
        ], 5),
        new TestCase([
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 1, 0],
            [0, 0, 0, 1, 0, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 1],
            [0, 0, 0, 0, 0, 0, 0, 0],
        ], 202),
        new TestCase([
            [0, 0],
            [0, 0],
            [0, 1],
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 1],
            [0, 0],
            [0, 0],
            [1, 0],
            [0, 0],
        ], 2),
        new TestCase([
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 1, 0, 0, 0, 0, 1, 0],
            [1, 1, 0, 1, 1, 0, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 1, 1],
            [0, 0, 0, 0, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 0, 0, 0, 1],
            [0, 0, 0, 0, 1, 0, 0, 0, 0],
            [0, 1, 0, 0, 1, 0, 0, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
        ], 240),
        new TestCase([
            [0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 1, 0, 0],
        ], 102),
    ];

    for (let [index, test] of testCases.entries()) {
        ns.run(`contracts/unique-paths-in-a-grid.js`, 1, JSON.stringify(test.input), Ports.CONTRACT_TEST_PORT);

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
