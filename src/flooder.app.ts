import { NS, Server } from "@ns";

const threadRam = 1.75; // mem of daemon script
const hackScript = `hack.daemon.js`;
const growScript = `grow.daemon.js`;
const weakenScript = `weaken.daemon.js`;

class Script {
    constructor(
        public script: string,
        public threads: number,
        public delay: number
    ) {}
}

function getHGW(ns: NS, server: Server, target: Server) {
    const weakenTime = ns.getWeakenTime(target.hostname);
    const growTime = ns.getGrowTime(target.hostname);
    const hackTime = ns.getHackTime(target.hostname);

    const hgw = [
        new Script(hackScript, 1, weakenTime - hackTime),
        new Script(growScript, 12, weakenTime - growTime),
        new Script(weakenScript, 1, 0),
    ];

    if (server.maxRam < threadRam * 3) {
        hgw.forEach((h) => (h.threads = 0));
        return hgw;
    }

    let hgwThreads = hgw.reduce((total, h) => (total += h.threads), 0);

    if (server.maxRam < threadRam * hgwThreads) {
        hgw[1].threads = Math.floor(
            (server.maxRam - threadRam * 2) / threadRam
        );
        return hgw;
    }

    const hgwRam = hgwThreads * threadRam;
    hgwThreads = Math.floor(server.maxRam / hgwRam);
    hgw.forEach((h) => (h.threads *= hgwThreads));
    return hgw;
}

async function execGrowth(ns: NS, server: Server) {
    await ns.scp(weakenScript, server.hostname);

    const maxThreads = Math.floor(server.maxRam / threadRam);
    const runOptions = {
        threads: maxThreads,
        preventDuplicates: true,
    };
    if (maxThreads === 0) return;
    ns.exec(weakenScript, server.hostname, runOptions, server.hostname, 0);
}

async function execHGW(ns: NS, server: Server, target: Server = server) {
    const hgw = getHGW(ns, server, target);
    const execDelay = 500;

    await ns.scp(
        hgw.map((h) => h.script),
        server.hostname
    );

    for (let h of hgw) {
        if (h.threads === 0) continue;
        const runOptions = {
            threads: h.threads,
            preventDuplicates: true,
        };
        ns.exec(
            h.script,
            server.hostname,
            runOptions,
            target.hostname,
            h.delay
        );
        await ns.sleep(execDelay);
    }
}

export async function main(ns: NS) {
    ns.disableLog(`ALL`);
    const tenMinutes = 1000 * 60 * 10;
    const serverFile = `known-servers.json.txt`;
    const flooded: Server[] = [];
    const bots: Server[] = [];
    const weakeningHosts = [];
    const bankFilter = (s: Server) => s.moneyMax || -1 > 0;
    let nextBankIndex = 0;

    while (true) {
        const servers: Server[] = JSON.parse(ns.read(serverFile)).filter(
            (s: Server) =>
                s.hasAdminRights &&
                s.hostname !== `home` &&
                flooded.findIndex((s2) => s2.hostname === s.hostname) < 0 &&
                bots.findIndex((s2) => s2.hostname === s.hostname) < 0
        );
        ns.print(`\nReloaded ${serverFile}`);

        let foundServer = false;
        for (let server of servers) {
            foundServer = true;
            if (!bankFilter(server)) {
                bots.push(server);
                continue;
            }

            if (server.hackDifficulty || -1 > (server.minDifficulty || -1)) {
                if (weakeningHosts.indexOf(server.hostname) < 0) {
                    ns.killall(server.hostname);
                    await execGrowth(ns, server);
                    weakeningHosts.push(server.hostname);
                }
                ns.print(`${server.hostname} (Bank) - Weakening`);
                continue;
            }

            ns.print(`${server.hostname} (Bank) - Flooding`);
            ns.killall(server.hostname);

            const growingIndex = weakeningHosts.indexOf(server.hostname);
            if (growingIndex > -1) {
                weakeningHosts.splice(growingIndex, 1);
            }

            await execHGW(ns, server);
            flooded.push(server);
        }

        const banks = flooded.filter(bankFilter);
        if (banks.length > 0) {
            for (let server of bots) {
                const target = banks[nextBankIndex];
                nextBankIndex = (nextBankIndex + 1) % banks.length;

                ns.print(
                    `${server.hostname} (Bot) - Flooding (${target.hostname})`
                );
                ns.killall(server.hostname);
                await execHGW(ns, server, target);
            }
        }

        if (!foundServer) {
            ns.print(`No known floodable servers.`);
        }

        ns.print(
            `Will search again at ${new Date(
                Date.now() + tenMinutes
            ).toLocaleTimeString(undefined, { hour12: false })}.`
        );
        await ns.sleep(tenMinutes);
    }
}
