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
        new TestCase(`135185197181`, [`135.185.197.181`]),
        new TestCase(`04748126`, [`0.47.48.126`]),
        new TestCase(`114227110211`, [`114.227.110.211`]),
        new TestCase(`20152128234`, [`20.152.128.234`, `201.52.128.234`]),
        new TestCase(`771241193`, [`7.71.241.193`, `77.1.241.193`, `77.12.41.193`, `77.124.1.193`, `77.124.11.93`, `77.124.119.3`]),
        new TestCase(`5822817460`, [`58.228.174.60`]),
        new TestCase(`2613314577`, [`26.133.145.77`]),
        new TestCase(`42157226192`, [`42.157.226.192`]),
        new TestCase(`23220462`, [`2.32.204.62`, `23.2.204.62`, `23.220.4.62`, `23.220.46.2`, `232.20.4.62`, `232.20.46.2`, `232.204.6.2`])
    ];

    for (let [index, test] of testCases.entries()) {
        ns.run(`contracts/generate-ip-addresses.js`, 1, JSON.stringify(test.input), Ports.CONTRACT_TEST_PORT);

        const port = ns.getPortHandle(Ports.CONTRACT_TEST_PORT);
        while (port.empty()) {
            await ns.sleep(1);
        }

        const response = JSON.parse(port.read());
        const result = test.output.every(val => response.indexOf(val) > -1);
        ns.tprint(`Test ${index + 1}/${testCases.length}: ${result ? `PASS` : `!!!! FAILED !!!!`}`);
        if (!result) {
            ns.tprint(`    Expected: ${JSON.stringify(test.output)}, Received: ${JSON.stringify(response)}`);
        }
    }
}
