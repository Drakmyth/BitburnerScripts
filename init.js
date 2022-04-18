/** @param {NS} ns **/
export async function main(ns) {
    const scripts = [
        `hacknet.app.js`,
        `netmapper.app.js`,
        `cracker.app.js`,
        `flooder.app.js`,
        `contracts.app.js`
    ];

    for (let script of scripts) {
        ns.tprint(`Starting ${script}...`);
        ns.run(script);
        await ns.sleep(1000);
    }

    ns.tprint(`All services started.`);
}
