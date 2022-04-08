/** @param {NS} ns */
function buy_servers(ns, ram) {
    while(ns.getPurchasedServers().length < ns.getPurchasedServerLimit()) {
        let bought = ns.purchaseServer("foo", ram) !== "";
        if (!bought) {
            ns.sleep(5000);
        }
    }
}

/** @param {NS} ns */
function delete_servers(ns) {
    let servers = ns.getPurchasedServers();
    for (let server of servers) {
        ns.killall(server);
        ns.deleteServer(server);
    }
}

/** @param {NS} ns */
function get_current_server_ram(ns) {
    let servers = ns.getPurchasedServers();
    return servers.length > 0 ? ns.getServerMaxRam(servers[0]) : 0.5;
}

/** @param {NS} ns */
function can_afford_upgrade(ns, ram) {
    let total_servers = ns.getPurchasedServerLimit();
    return ns.getPlayer().money >= ns.getPurchasedServerCost(ram) * total_servers;
}

/** @param {NS} ns */
export async function main(ns) {

    let flags = ns.flags([
        ['s', false],
        ['simulate', false]
    ]);

    let simulate = flags['s'] || flags['simulate'];

    let current_ram = get_current_server_ram(ns);
    ns.tprint("Current Server RAM: " + current_ram);
    let next_upgrade = current_ram;
    while(can_afford_upgrade(ns, next_upgrade * 2)) {
        next_upgrade *= 2;
    }
    
    if (current_ram === next_upgrade) {
        ns.tprint("Next upgrade at $" + ns.getPurchasedServerCost(next_upgrade * 2) * ns.getPurchasedServerLimit());
        return;
    }
    
    ns.tprint("Next Affordable Upgrade: " + next_upgrade);

    if (!simulate) {
        delete_servers(ns);
        ns.tprint("Buying upgraded servers...");
        buy_servers(ns, next_upgrade);
        ns.tprint("Servers upgraded. Make sure to run flood.js.");
    }
}
