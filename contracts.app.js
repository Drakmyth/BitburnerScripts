import * as Ports from "ports.lib.js";
import { ContractSolver } from "contracts.lib.js";

class Contract {
    constructor(title, filename, host) {
        this.title = title;
        this.filename = filename;
        this.host = host;
    }
}

/** @param {NS} ns */
function getContractsFromHost(ns, host) {
    const contracts = [];
    const contractFilenames = ns.ls(host, `.cct`);
    for (let filename of contractFilenames) {
        const title = ns.codingcontract.getContractType(filename, host);
        contracts.push(new Contract(title, filename, host));
    }

    return contracts;
}

/** @param {NS} ns */
function findAllContracts(ns) {
    const serverFile = `known-servers.json.txt`;
    const servers = JSON.parse(ns.read(serverFile));

    ns.print(`\nReloaded ${serverFile}`);
    ns.print(`Searching for contracts...`);

    const contracts = [];
    for (let server of servers) {
        const hostContracts = getContractsFromHost(ns, server.hostname);
        contracts.push(...hostContracts);
    }

    return contracts;
}

/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog(`ALL`);

    const tenMinutes = 1000 * 60 * 10;

    while (true) {
        const contracts = findAllContracts(ns);

        if (contracts.length < 1) {
            ns.print(`No contracts found.`);
        }

        for (let contract of contracts) {
            ns.print(`Found: ${contract.host} - ${contract.filename} - ${contract.title}`);
            const solver = ContractSolver.findSolver(contract.title);
            if (solver === undefined) {
                ns.print(`    !!!! NEW !!!!`);
                continue;
            }

            const result = await solver.solve(ns, contract.filename, contract.host, Ports.CONTRACT_PORT);
            let prefix = `Reward`;
            if (!result.solved) {
                ns.tail();
                ns.print(`    !!!! FAILED !!!!`);
                prefix = `Failure`;
            }
            ns.print(`    ${prefix}: ${result.message}`);
        }

        ns.print(`Will search again at ${new Date(Date.now() + tenMinutes).toLocaleTimeString(_, { hour12: false })}.`);
        await ns.sleep(tenMinutes);
    }
}
