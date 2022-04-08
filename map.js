/** @param {NS} ns */
function print_host(ns, prefix, host) {
	let label = prefix + "  \\-- " + host;

	let flags = ns.flags([
		['o', false],
		['organization', false]
	]);

	let show_organization = flags['o'] || flags['organization'];
	if (show_organization) {
		label += " (" + ns.getServer(host).organizationName + ")";
	}

	ns.tprint(label);
}

/** @param {NS} ns */
function walk(ns, host, prefix="") {
	let servers = ns.scan(host);
	servers.shift();
	for (let [index, next] of servers.entries()) {
		print_host(ns, prefix, next);
		let next_prefix = prefix + (index < servers.length - 1 ? "  |  " : "     ")
		walk(ns, next, next_prefix);
	}
}

/** @param {NS} ns */
export async function main(ns) {
	ns.tprint("home");
	walk(ns, "home");
}
