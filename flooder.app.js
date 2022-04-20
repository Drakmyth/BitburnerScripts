const threadRam = 1.75; // mem of daemon script
const hackScript = `hack.daemon.js`;
const growScript = `grow.daemon.js`;
const weakenScript = `weaken.daemon.js`;

class Script {
    constructor(script, threads, delay) {
        this.script = script;
        this.threads = threads;
        this.delay = delay;
    }
}

/** @param {NS} ns **/
function getHGW(ns, server, target) {

    const weakenTime = ns.getWeakenTime(target.hostname);
    const growTime = ns.getGrowTime(target.hostname);
    const hackTime = ns.getHackTime(target.hostname);

    const hgw = [
        new Script(hackScript, 1, weakenTime - hackTime),
        new Script(growScript, 12, weakenTime - growTime),
        new Script(weakenScript, 1, 0)
    ]

    if (server.maxRam < threadRam * 3) {
        hgw.forEach(h => h.threads = 0);
        return hgw;
    }

    let hgwThreads = hgw.reduce((total, h) => total += h.threads, 0);

    if (server.maxRam < threadRam * hgwThreads) {
        hgw[1].threads = Math.floor((server.maxRam - (threadRam * 2)) / threadRam);
        return hgw;
    }

    const hgwRam = hgwThreads * threadRam;
    hgwThreads = Math.floor(server.maxRam / hgwRam);
    hgw.forEach(h => h.threads *= hgwThreads);
    return hgw;
}

/** @param {NS} ns **/
async function execGrowth(ns, server) {
    await ns.scp(weakenScript, server.hostname);

    const maxThreads = Math.floor(server.maxRam / threadRam);
    if (maxThreads === 0) return;
    ns.exec(weakenScript, server.hostname, maxThreads, server.hostname, 0);
}

/** @param {NS} ns **/
async function execHGW(ns, server, target=server) {
    const hgw = getHGW(ns, server, target);
    const execDelay = 500;

    await ns.scp(hgw.map(h => h.script), server.hostname);

    for (let h of hgw) {
        if (h.threads === 0) continue;
        ns.exec(h.script, server.hostname, h.threads, target.hostname, h.delay);
        await ns.sleep(execDelay);
    }
}

/** @param {NS} ns **/
export async function main(ns) {
    ns.disableLog(`ALL`);
    const tenMinutes = 1000 * 60 * 10;
    const serverFile = `known-servers.json`;
    const flooded = [];
    const bots = [];
    const weakeningHosts = [];
    const bankFilter = s => s.moneyMax > 0;
    let nextBankIndex = 0;

    while (true) {
        const servers = JSON.parse(ns.read(serverFile)).filter(s => s.hasAdminRights && s.hostname !== `home` && flooded.findIndex(s2 => s2.hostname === s.hostname) < 0 && bots.findIndex(s2 => s2.hostname === s.hostname) < 0);
        ns.print(`\nReloaded ${serverFile}`);

        let foundServer = false;
        for (let server of servers) {
            foundServer = true;
            if (!bankFilter(server)) {
                bots.push(server);
                continue;
            }

            if (server.hackDifficulty > server.minDifficulty) {
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
    
                ns.print(`${server.hostname} (Bot) - Flooding (${target.hostname})`);
                ns.killall(server.hostname);
                await execHGW(ns, server, target);
            }
        }

        if (!foundServer) {
            ns.print(`No known floodable servers.`);
        }

        ns.print(`Will search again at ${new Date(Date.now() + tenMinutes).toLocaleTimeString(_, { hour12: false })}.`);
        await ns.sleep(tenMinutes);
    }
}
