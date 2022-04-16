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
    new ContractType(`Find Largest Prime Factor`, `contracts/find-largest-prime-factor.js`),
    new ContractType(`HammingCodes: Integer to encoded Binary`, `contracts/hammingcodes-integer-to-encoded-binary.js`),
    new ContractType(`Merge Overlapping Intervals`, `contracts/merge-overlapping-intervals.js`),
    new ContractType(`Minimum Path Sum in a Triangle`, `contracts/minimum-path-sum-in-a-triangle.js`),
    new ContractType(`Spiralize Matrix`, `contracts/spiralize-matrix.js`),
    new ContractType(`Subarray with Maximum Sum`, `contracts/subarray-with-maximum-sum.js`),
    new ContractType(`Total Ways to Sum`, `contracts/total-ways-to-sum.js`),
    new ContractType(`Unique Paths in a Grid I`, `contracts/unique-paths-in-a-grid-i.js`)
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

        ns.run(this.type.script, 1, JSON.stringify(this.type.processInput(this.input)), Ports.CONTRACT_PORT);

        let port = ns.getPortHandle(Ports.CONTRACT_PORT);
        while (port.empty()) {
            await ns.sleep(1);
        }

        let answer = JSON.parse(port.read());
        let result = ns.codingcontract.attempt(answer, this.file, this.host, { returnReward: true });
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
    let contracts = [];
    let contractFiles = ns.ls(host, `.cct`);
    for (let file of contractFiles) {
        let title = ns.codingcontract.getContractType(file, host);
        let type = contractTypes.find(t => t.title === title) || new ContractType(title);
        let input = ns.codingcontract.getData(file, host);
        contracts.push(new Contract(type, input, host, file));
    }

    return contracts;
}

/** @param {NS} ns */
export async function main(ns) {
    ns.tail();
    ns.disableLog(`ALL`);
    let tenMinutes = 1000 * 60 * 10;
    let serverFile = `known-servers.json`;
    while (true) {
        let servers = JSON.parse(ns.read(serverFile));

        ns.print(`\nReloaded ${serverFile}`);
        ns.print(`Searching for contracts...`);

        let foundContracts = false;
        for (let server of servers) {
            let contracts = getContracts(ns, server.hostname);
            foundContracts = foundContracts || contracts.length > 0;
            for (let contract of contracts) {
                ns.print(`Found: ${contract}`);
                let status = await contract.solve(ns);
                switch (status) {
                    case `reward`:
                        ns.print(`    Reward: ${contract.reward}`);
                        break;
                    case `fail`:
                        ns.print(`    !!!! FAILED !!!!`);
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
        ns.print(`Will search again in 10 minutes.`);
        await ns.sleep(tenMinutes);
    }
}
