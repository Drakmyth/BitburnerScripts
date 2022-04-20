/** @param {NS} ns **/
export async function main(ns) {
    const scripts = [
        `hacknet.app.js`,
        `netmapper.app.js`,
        `cracker.app.js`,
        `flooder.app.js`,
        `contracts.app.js`
    ];

    const host = ns.getHostname();
    let usedRam = ns.getServerUsedRam(host);
    const maxRam = ns.getServerMaxRam(host);
    for (let script of scripts) {
        ns.tprint(`Starting ${script}...`);

        const scriptRam = ns.getScriptRam(script, host);
        if (scriptRam === 0) {
            ns.tprint(`ERROR: ${script} not found.`);
            continue;
        }
        
        if (usedRam + scriptRam > maxRam) {
            ns.tprint(`ERROR: Not enough RAM available to run ${script}. ${maxRam - usedRam} available, ${scriptRam} required.`);
            continue;
        }

        const pid = ns.run(script);
        ns.tail(pid);
        await ns.sleep(1000);
    }

    ns.tprint(`All services started.`);
}
