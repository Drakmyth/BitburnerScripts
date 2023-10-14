import { NS } from "@ns";

async function buy_servers(ns: NS, ram: number) {
    while (ns.getPurchasedServers().length < ns.getPurchasedServerLimit()) {
        const bought = ns.purchaseServer(`foo`, ram) !== ``;
        if (!bought) {
            await ns.sleep(5000);
        }
    }
}

function delete_servers(ns: NS) {
    const servers = ns.getPurchasedServers();
    for (let server of servers) {
        ns.killall(server);
        ns.deleteServer(server);
    }
}

function get_current_server_ram(ns: NS) {
    const servers = ns.getPurchasedServers();
    return servers.length > 0 ? ns.getServerMaxRam(servers[0]) : 0;
}

function can_afford_upgrade(ns: NS, ram: number) {
    const total_servers = ns.getPurchasedServerLimit();
    return (
        ns.getPlayer().money >= ns.getPurchasedServerCost(ram) * total_servers
    );
}

export async function main(ns: NS) {
    const flags = ns.flags([
        [`s`, false],
        [`simulate`, false],
    ]);

    const simulate = flags[`s`] || flags[`simulate`];

    const current_ram = get_current_server_ram(ns);
    const daemon_ram = ns.getScriptRam(`daemon.js`);

    let minimum_ram = 1;
    while (minimum_ram < daemon_ram) {
        minimum_ram *= 2;
    }

    ns.tprint(`Current Server RAM: ${current_ram}`);
    let next_upgrade =
        current_ram < minimum_ram ? minimum_ram : current_ram * 2;
    while (can_afford_upgrade(ns, next_upgrade * 2)) {
        next_upgrade *= 2;
    }

    if (current_ram === next_upgrade) {
        const upgrade_cost =
            ns.getPurchasedServerCost(next_upgrade * 2) *
            ns.getPurchasedServerLimit();

        const formatted_cost = Intl.NumberFormat(undefined, {
            style: "currency",
            currency: "USD",
            currencyDisplay: "narrowSymbol",
            currencySign: "accounting",
            maximumFractionDigits: 3,
        }).format(upgrade_cost);

        ns.tprint(`Next upgrade (${next_upgrade * 2}) at ${formatted_cost}`);
        return;
    } else if (simulate) {
        const upgrade_cost =
            ns.getPurchasedServerCost(next_upgrade) *
            ns.getPurchasedServerLimit();

        const formatted_cost = Intl.NumberFormat(undefined, {
            style: "currency",
            currency: "USD",
            currencyDisplay: "narrowSymbol",
            currencySign: "accounting",
            maximumFractionDigits: 3,
        }).format(upgrade_cost);

        ns.tprint(`Next upgrade (${next_upgrade}) at ${formatted_cost}`);
        return;
    }

    ns.tprint(`Next Affordable Upgrade: ${next_upgrade}`);

    if (!simulate) {
        delete_servers(ns);
        ns.tprint(`Buying upgraded servers...`);
        await buy_servers(ns, next_upgrade);
        ns.tprint(`Servers upgraded. Make sure to run flood.js.`);
    }
}
