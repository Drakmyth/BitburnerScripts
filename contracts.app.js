import * as Ports from "ports.lib.js";

class ContractType {
    constructor(title, script = ``, inputProcessor = (input) => input) {
        this.title = title;
        this.script = script;
        this.processInput = inputProcessor;
    }
}

const contractTypes = [
    new ContractType(`Algorithmic Stock Trader I`, `contracts/algorithmic-stock-trader.js`, (input) => [1, input]),
    new ContractType(`Algorithmic Stock Trader II`, `contracts/algorithmic-stock-trader.js`, (input) => [input.length, input]),
    new ContractType(`Algorithmic Stock Trader III`, `contracts/algorithmic-stock-trader.js`, (input) => [2, input]),
    new ContractType(`Algorithmic Stock Trader IV`, `contracts/algorithmic-stock-trader.js`),
    new ContractType(`Array Jumping Game`, `contracts/array-jumping-game.js`),
    new ContractType(`Array Jumping Game II`, `contracts/array-jumping-game-ii.js`),
    new ContractType(`Compression I: RLE Compression`, `contracts/compression-i-rle-compression.js`),
    new ContractType(`Encryption I: Caesar Cipher`, `contracts/encryption-i-caesar-cipher.js`),
    new ContractType(`Encryption II: Vigenère Cipher`, `contracts/encryption-ii-vigenere-cipher.js`),
    new ContractType(`Find Largest Prime Factor`, `contracts/find-largest-prime-factor.js`),
    new ContractType(`Generate IP Addresses`, `contracts/generate-ip-addresses.js`),
    new ContractType(`HammingCodes: Integer to Encoded Binary`, `contracts/hammingcodes-integer-to-encoded-binary.js`),
    new ContractType(`Merge Overlapping Intervals`, `contracts/merge-overlapping-intervals.js`),
    new ContractType(`Minimum Path Sum in a Triangle`, `contracts/minimum-path-sum-in-a-triangle.js`),
    new ContractType(`Proper 2-Coloring of a Graph`, `contracts/proper-2-coloring-of-a-graph.js`),
    new ContractType(`Sanitize Parentheses in Expression`, `contracts/sanitize-parentheses-in-expression.js`),
    new ContractType(`Spiralize Matrix`, `contracts/spiralize-matrix.js`),
    new ContractType(`Subarray with Maximum Sum`, `contracts/subarray-with-maximum-sum.js`),
    new ContractType(`Total Ways to Sum`, `contracts/total-ways-to-sum.js`, (input) => [input, [...Array(input).keys()].filter(a => a > 0)]),
    new ContractType(`Total Ways to Sum II`, `contracts/total-ways-to-sum.js`),
    new ContractType(`Unique Paths in a Grid I`, `contracts/unique-paths-in-a-grid.js`, (input) => Array(input[0]).fill(null).map(() => Array(input[1]).fill(0))),
    new ContractType(`Unique Paths in a Grid II`, `contracts/unique-paths-in-a-grid.js`)
];

class Contract {
    constructor(type, input, host, file) {
        this.type = type;
        this.input = input;
        this.host = host;
        this.file = file;
        this.reward = ``;
        this.failure = ``;
    }

    toString() {
        return `${this.host} - ${this.file} - ${this.type.title}`;
    }

    /** @param {NS} ns */
    async solve(ns) {
        if (this.type.script === ``) {
            return `new`;
        }

        const processedInput = this.type.processInput(this.input);
        ns.run(this.type.script, 1, JSON.stringify(processedInput), Ports.CONTRACT_PORT);

        const port = ns.getPortHandle(Ports.CONTRACT_PORT);
        while (port.empty()) {
            await ns.sleep(1);
        }

        const answer = JSON.parse(port.read());
        const result = ns.codingcontract.attempt(answer, this.file, this.host, { returnReward: true });
        if (result !== ``) {
            this.reward = result;
            return `reward`;
        } else {
            this.failure = `Answer: ${answer}, Input: ${this.input}`;
            return `fail`
        }
    }
}

/** @param {NS} ns */
function getContracts(ns, host) {
    const contracts = [];
    const contractFiles = ns.ls(host, `.cct`);
    for (let file of contractFiles) {
        const title = ns.codingcontract.getContractType(file, host);
        const type = contractTypes.find(t => t.title === title) || new ContractType(title);
        const input = ns.codingcontract.getData(file, host);
        contracts.push(new Contract(type, input, host, file));
    }

    return contracts;
}

/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog(`ALL`);
    ns.tail();

    const tenMinutes = 1000 * 60 * 10;
    const serverFile = `known-servers.json.txt`;
    while (true) {
        const servers = JSON.parse(ns.read(serverFile));

        ns.print(`\nReloaded ${serverFile}`);
        ns.print(`Searching for contracts...`);

        let foundContracts = false;
        for (let server of servers) {
            const contracts = getContracts(ns, server.hostname);
            foundContracts = foundContracts || contracts.length > 0;
            for (let contract of contracts) {
                ns.print(`Found: ${contract}`);
                const status = await contract.solve(ns);
                switch (status) {
                    case `reward`:
                        ns.print(`    Reward: ${contract.reward}`);
                        break;
                    case `fail`:
                        ns.print(`    !!!! FAILED !!!!`);
                        ns.print(`    Failure: ${contract.failure}`);
                        break;
                    case `new`:
                        ns.print(`    !!!! NEW !!!!`);
                        break;
                    default:
                        break;
                }
            }
        }
        if (!foundContracts) {
            ns.print(`No contracts found.`);
        }
        ns.print(`Will search again at ${new Date(Date.now() + tenMinutes).toLocaleTimeString(_, { hour12: false })}.`);
        await ns.sleep(tenMinutes);
    }
}
