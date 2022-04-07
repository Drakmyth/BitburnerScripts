/** @param {NS} ns */
function walk(ns, host, prefix="") {
	let servers = ns.scan(host);
	servers.shift();
	for (let [index, next] of servers.entries()) {
		ns.tprint(prefix + "  \\-- " + host);
		let next_prefix = prefix + (index < servers.length - 1 ? "  |  " : "     ")
		walk(ns, next, next_prefix);
	}
}

/** @param {NS} ns */
export async function main(ns) {
	ns.tprint("home");
	walk(ns, "home");
}
