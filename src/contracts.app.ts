import * as Ports from "./ports.lib";
import { ContractSolver } from "./contracts.lib";
import { NS } from "@ns";

class Contract {
    constructor(
        public title: string,
        public filename: string,
        public host: string
    ) {}
}

function getContractsFromHost(ns: NS, host: string) {
    const contracts = [];
    const contractFilenames = ns.ls(host, `.cct`);
    for (let filename of contractFilenames) {
        const title = ns.codingcontract.getContractType(filename, host);
        contracts.push(new Contract(title, filename, host));
    }

    return contracts;
}

function findAllContracts(ns: NS) {
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

export async function main(ns: NS) {
    ns.disableLog(`ALL`);

    const tenMinutes = 1000 * 60 * 10;

    while (true) {
        const contracts = findAllContracts(ns);

        if (contracts.length < 1) {
            ns.print(`No contracts found.`);
        }

        for (let contract of contracts) {
            ns.print(
                `Found: ${contract.host} - ${contract.filename} - ${contract.title}`
            );
            const solver = ContractSolver.findSolver(contract.title);
            if (solver === undefined) {
                ns.print(`    !!!! NEW !!!!`);
                continue;
            }

            const result = await solver.solve(
                ns,
                contract.filename,
                contract.host,
                Ports.CONTRACT_PORT
            );
            let prefix = `Reward`;
            if (!result.solved) {
                ns.tail();
                ns.print(`    !!!! FAILED !!!!`);
                prefix = `Failure`;
            }
            ns.print(`    ${prefix}: ${result.message}`);
        }

        ns.print(
            `Will search again at ${new Date(
                Date.now() + tenMinutes
            ).toLocaleTimeString(undefined, { hour12: false })}.`
        );
        await ns.sleep(tenMinutes);
    }
}
