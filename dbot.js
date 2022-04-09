/** @param {NS} ns */
function get_targets(ns, host) {
	let servers = ns.scan(host);
    if (host != "home") {
        servers.shift();
    }

    let children = new Set(servers);

    for (let server of servers) {
        let next = get_targets(ns, server);
        next.forEach(n => children.add(n));
    }

    return children;
}

/** @param {NS} ns **/
export async function main(ns) {
	let targets = get_targets(ns, "home");

    while(true) {
        for (let target of targets) {
            if (ns.getHackingLevel() < ns.getServerRequiredHackingLevel(target)) continue;

            let moneyThresh = ns.getServerMaxMoney(target) * 0.75;
            let securityThresh = ns.getServerMinSecurityLevel(target) + 5;

            while (ns.getServerSecurityLevel(target) > securityThresh) {
                await ns.weaken(target);
            }

            while (ns.getServerMoneyAvailable(target) > moneyThresh) {
                await ns.hack(target);
            }
        }

        await ns.sleep(5000);
	}
}
