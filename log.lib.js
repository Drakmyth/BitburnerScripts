/** @param {NS} ns */
function is_verbose(ns) {
	let data = ns.flags([
		['verbose', false],
		['v', false]
	]);

	return data['verbose'] || data['v'];
}

/** @param {NS} ns */
export function info(ns, msg) {
	ns.tprint(msg);
}

/** @param {NS} ns */
export function verbose(ns, msg) {
	let ver = is_verbose(ns);
	if (ver) {
		info(ns, msg);
	}
}
