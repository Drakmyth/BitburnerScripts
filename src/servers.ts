import { NS } from "@ns";

async function get_servers(ns: NS, ram: number) {
    while (ns.getPurchasedServers().length < ns.getPurchasedServerLimit()) {
        const append = ns.getPurchasedServers().length;
        const bought = ns.purchaseServer(`foo-${append}`, ram) !== ``;
        if (!bought) {
            await ns.sleep(5000);
        }
    }
}

function upgrade_servers(ns: NS, ram: number) {
    const servers = ns.getPurchasedServers();
    for (let server of servers) {
        ns.killall(server);
        ns.upgradePurchasedServer(server, ram);
    }
}

function get_current_server_ram(ns: NS) {
    const servers = ns.getPurchasedServers();
    return servers.length > 0 ? ns.getServerMaxRam(servers[0]) : 0;
}

function can_afford_upgrade(ns: NS, ram: number, current: number) {
    const total_servers = ns.getPurchasedServerLimit();
    if (total_servers === 0) return false;
    return (
        ns.getPlayer().money >=
        ns.getPurchasedServerCost(ram) * total_servers -
            ns.getPurchasedServerCost(current) * total_servers
    );
}

export async function main(ns: NS) {
    const flags = ns.flags([
        [`s`, false],
        [`simulate`, false],
    ]);

    const simulate = flags[`s`] || flags[`simulate`];

    const current_ram = get_current_server_ram(ns);
    const daemon_ram =
        ns.getScriptRam(`grow.daemon.js`) +
        ns.getScriptRam(`hack.daemon.js`) +
        ns.getScriptRam(`weaken.daemon.js`);

    let minimum_ram = 1;
    while (minimum_ram < daemon_ram) {
        minimum_ram *= 2;
    }

    ns.tprint(`Current Server RAM: ${current_ram}`);
    let next_upgrade =
        current_ram < minimum_ram ? minimum_ram : current_ram * 2;
    while (can_afford_upgrade(ns, next_upgrade * 2, current_ram)) {
        next_upgrade *= 2;
    }

    let upgrade_cost =
        ns.getPurchasedServerCost(next_upgrade) * ns.getPurchasedServerLimit() -
        ns.getPurchasedServerCost(current_ram) * ns.getPurchasedServerLimit();

    let formatted_cost = Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "USD",
        currencyDisplay: "narrowSymbol",
        currencySign: "accounting",
        maximumFractionDigits: 3,
    }).format(upgrade_cost);

    if (current_ram === next_upgrade) {
        upgrade_cost =
            ns.getPurchasedServerCost(next_upgrade) *
            ns.getPurchasedServerLimit();

        formatted_cost = Intl.NumberFormat(undefined, {
            style: "currency",
            currency: "USD",
            currencyDisplay: "narrowSymbol",
            currencySign: "accounting",
            maximumFractionDigits: 3,
        }).format(upgrade_cost);

        ns.tprint(`Next upgrade (${next_upgrade * 2}) at ${formatted_cost}`);
        return;
    } else if (simulate) {
        ns.tprint(`Next upgrade (${next_upgrade}) at ${formatted_cost}`);
        return;
    }

    ns.tprint(`Next Affordable Upgrade: ${next_upgrade}`);

    if (!simulate) {
        if (ns.getPurchasedServers().length === 0) {
            ns.tprint(`Buying servers...`);
            await get_servers(ns, minimum_ram);
        } else if (ns.getPlayer().money < upgrade_cost) {
            ns.tprint(`Not enough money to upgrade servers.`);
            return;
        } else {
            ns.tprint(`Upgrading servers...`);
            upgrade_servers(ns, next_upgrade);
        }
        ns.tprint(`Servers upgraded. Make sure to run flooder.app.js.`);
    }
}
