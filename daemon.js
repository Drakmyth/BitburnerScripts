/** @param {NS} ns **/
export async function main(ns) {
	let host = ns.args[0];
	let moneyThresh = ns.getServerMaxMoney(host) * 0.75;
	let securityThresh = ns.getServerMinSecurityLevel(host) + 5;

	if (ns.getHackingLevel() < ns.getServerRequiredHackingLevel(host)) {
		return;
	}

	while(true) {
		if (ns.getServerSecurityLevel(host) > securityThresh) {
			await ns.weaken(host);
		} else if (ns.getServerMoneyAvailable(host) < moneyThresh) {
			await ns.grow(host);
		} else {
			await ns.hack(host);
		}
	}
}
