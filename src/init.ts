import { NS } from "@ns";

class Script {
    constructor(
        public filename: string,
        public args: any[] = [],
        public tail: boolean = false
    ) {}
}

export async function main(ns: NS) {
    const scripts = [
        new Script(`hacknet.app.js`),
        new Script(`netmapper.app.js`, [], true),
        new Script(`cracker.app.js`, [], true),
        new Script(`flooder.app.js`),
        new Script(`contracts.app.js`, [], true),
    ];

    const host = ns.getHostname();
    let usedRam = ns.getServerUsedRam(host);
    const maxRam = ns.getServerMaxRam(host);
    for (let script of scripts) {
        ns.tprint(`Starting ${script.filename}...`);

        const scriptRam = ns.getScriptRam(script.filename, host);
        if (scriptRam === 0) {
            ns.tprint(`ERROR: ${script.filename} not found.`);
            continue;
        }

        if (usedRam + scriptRam > maxRam) {
            ns.tprint(
                `ERROR: Not enough RAM available to run ${script.filename}. ${
                    maxRam - usedRam
                }GB available, ${scriptRam}GB required.`
            );
            continue;
        }

        const runOptions = {
            threads: 1,
            preventDuplicates: true,
        };
        const pid = ns.run(script.filename, runOptions, ...script.args);
        if (pid === 0) {
            ns.tprint(`ERROR: Unknown error starting ${script.filename}.`);
            continue;
        } else {
            usedRam += scriptRam;
        }

        if (script.tail) {
            ns.tail(pid);
        }
        await ns.sleep(1000);
    }

    ns.tprint(`All services started.`);
}
