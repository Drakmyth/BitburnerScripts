class Program {
    constructor(filename, execFunc) {
        this.filename = filename;
        this.execute = execFunc;
    }
}

/** @param {NS} ns **/
export async function main(ns) {
    ns.tail();
    ns.disableLog(`ALL`);
    let tenMinutes = 1000 * 60 * 10;
    let serverFile = `known-servers.json`;
    let programs = [
        new Program(`BruteSSH.exe`, host => ns.brutessh(host)),
        new Program(`SQLInject.exe`, host => ns.sqlinject(host)),
        new Program(`relaySMTP.exe`, host => ns.relaysmtp(host)),
        new Program(`FTPCrack.exe`, host => ns.ftpcrack(host)),
        new Program(`HTTPWorm.exe`, host =>ns.httpworm(host))
    ]
    while(true) {
        let servers = JSON.parse(ns.read(serverFile));
        ns.print(`\nReloaded ${serverFile}`);
        let playerSkill = ns.getHackingLevel();
        let ownedPrograms = programs.filter(p => ns.fileExists(p.filename));

        let crackedAny = false;
        for (let server of servers) {
            if (server.hasAdminRights) continue;
            if (server.requiredHackingSkill > playerSkill) continue;
            if (server.numOpenPortsRequired > ownedPrograms.length) continue;

            ns.print(`\nCracking ${server.hostname}...`);
            ns.print(`Skill: ${playerSkill}/${server.requiredHackingSkill} Ports: ${server.openPortCount}/${server.numOpenPortsRequired}`);
            ns.print(`Opening ports...`)
            for (let program of ownedPrograms) {
                program.execute(server.hostname);
            }
            
            ns.print(`Nuking...`)
            ns.nuke(server.hostname);
            ns.print(`${server.hostname} cracked.`)
            crackedAny = true;
        }
        
        if (!crackedAny) {
            ns.print(`No known crackable servers.`);
        }

        ns.print(`Will search again in 10 minutes.`);
        await ns.sleep(tenMinutes);
    }
}
