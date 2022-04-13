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
        new TestCase([
            [6],
            [5, 4],
            [5, 1, 5],
            [4, 4, 9, 6],
            [4, 4, 3, 3, 9],
            [3, 5, 7, 3, 7, 8],
            [1, 3, 4, 8, 7, 5, 6],
            [3, 6, 2, 1, 3, 2, 4, 9],
            [6, 8, 2, 7, 5, 8, 6, 9, 8],
            [5, 2, 1, 6, 5, 8, 8, 3, 3, 4],
        ], 32),
        new TestCase([
            [9],
            [5, 5],
            [8, 3, 6],
            [8, 6, 9, 1],
            [7, 6, 4, 1, 7],
            [8, 1, 2, 7, 9, 4],
            [8, 1, 5, 2, 5, 1, 5],
            [4, 6, 8, 3, 4, 6, 2, 8],
        ], 34),
        new TestCase([
            [3],
            [4, 7],
            [3, 5, 2],
            [4, 8, 5, 1],
            [3, 5, 1, 5, 9],
            [8, 5, 5, 3, 7, 8],
        ], 21),
        new TestCase([
            [5],
            [5, 1],
            [1, 4, 5],
            [1, 8, 9, 6],
            [6, 7, 3, 7, 8],
            [7, 7, 4, 5, 3, 5],
            [4, 7, 5, 9, 8, 3, 8],
            [1, 4, 4, 6, 7, 4, 2, 5],
            [8, 5, 5, 8, 5, 1, 2, 2, 6],
            [9, 2, 3, 8, 5, 7, 9, 2, 6, 1],
            [3, 7, 7, 5, 5, 3, 4, 4, 8, 3, 5],
        ], 40),
        new TestCase([
            [9],
            [5, 6],
            [4, 5, 6],
            [6, 9, 9, 3],
            [3, 5, 9, 3, 2],
            [5, 8, 2, 7, 4, 8],
            [1, 3, 6, 2, 6, 6, 1],
            [9, 1, 9, 4, 7, 4, 4, 3],
            [8, 3, 1, 3, 3, 7, 7, 5, 7],
            [6, 8, 4, 5, 6, 9, 6, 2, 1, 3],
            [4, 6, 8, 6, 2, 7, 3, 2, 4, 6, 6],
            [7, 1, 2, 2, 4, 8, 1, 6, 6, 2, 1, 2],
        ], 46),
    ];

    for (let [index, test] of testCases.entries()) {
        ns.run(`contracts/mpst.js`, 1, JSON.stringify(test.input), Ports.CONTRACT_TEST_PORT);

        let port = ns.getPortHandle(Ports.CONTRACT_TEST_PORT);
        while (port.empty()) {
            await ns.sleep(1);
        }

        let result = port.read() === test.output;
        ns.tprint(`Test ${index + 1}/${testCases.length}: ${result ? `PASS` : `!!!! FAILED !!!!`}`);
    }
}
