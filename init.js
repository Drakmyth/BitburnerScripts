/** @param {NS} ns **/
export async function main(ns) {
    let scripts = [
        `hacknet.app.js`,
        `netmapper.app.js`,
        `cracker.app.js`,
        `contracts.app.js`
    ];

    for (let script of scripts) {
        ns.tprint(`Starting ${script}...`);
        ns.run(script);
        await ns.sleep(1000);
    }

    ns.tprint(`All services started.`);
}
