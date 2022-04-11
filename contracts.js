/** @param {NS} ns */
function walk(ns, host) {
    let contracts = ns.ls(host, ".cct");
    for (let contract of contracts) {
        let title = ns.codingcontract.getContractType(contract, host);
        ns.tprint(host + " - " + contract + " - " + title);
    }

	let servers = ns.scan(host);
	if (host != "home") {
		servers.shift();
	}
	
	for (let child of servers) {
		walk(ns, child);
	}
}

/** @param {NS} ns */
export async function main(ns) {
	let host = "home";
	if (ns.args.length > 0) {
		host = ns.args[0];
	}
	walk(ns, host);
}
