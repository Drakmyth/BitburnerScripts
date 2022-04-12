/** @param {NS} ns */
function print_host(ns, prefix, host) {
	let label = prefix + "  \\-- " + host;

	let flags = ns.flags([
		['l', false],
		['level', false],
		['o', false],
		['organization', false],
		['m', false],
		['money', false],
		['r', false],
		['root', false]
	]);

	let show_level = flags['l'] || flags['level'];
	let show_organization = flags['o'] || flags['organization'];
	let show_money = flags['m'] || flags['money'];
	let show_root = flags['r'] || flags['root'];
	let server = ns.getServer(host);

	let tags = []

	if (show_level) {
		tags.push(server.requiredHackingSkill);
	}
	if (show_organization) {
		tags.push(server.organizationName);
	}
	if (show_money) {
		tags.push(ns.nFormat(server.moneyAvailable, '($0.000a)'));
	}
	if (show_root) {
		tags.push(server.hasAdminRights ? "ROOT" : "USER");
	}

	if (tags.length > 0) {
		label += " (" + tags.join(" - ") + ")";
	}

	ns.tprint(label);
}

/** @param {NS} ns */
function walk(ns, host, prefix="") {
	let servers = ns.scan(host);
	if (host != "home") {
		servers.shift();
	}
	
	for (let [index, next] of servers.entries()) {
		print_host(ns, prefix, next);
		let next_prefix = prefix + (index < servers.length - 1 ? "  |  " : "     ")
		walk(ns, next, next_prefix);
	}
}

/** @param {NS} ns */
export async function main(ns) {
	let host = "home";
	let args = ns.args.filter(a => a[0] != '-');
	if (args.length > 0) {
		host = args[0];
	}
	ns.tprint(host);
	walk(ns, host);
}
