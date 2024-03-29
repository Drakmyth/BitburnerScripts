import { NS } from "@ns";

function print_host(ns: NS, prefix: string, host: string) {
    let label = `${prefix}  \\-- ${host}`;

    const flags = ns.flags([
        [`l`, false],
        [`level`, false],
        [`o`, false],
        [`organization`, false],
        [`m`, false],
        [`money`, false],
        [`r`, false],
        [`root`, false],
    ]);

    const show_level = flags[`l`] || flags[`level`];
    const show_organization = flags[`o`] || flags[`organization`];
    const show_money = flags[`m`] || flags[`money`];
    const show_root = flags[`r`] || flags[`root`];
    const server = ns.getServer(host);

    const tags: string[] = [];

    if (show_level && server.requiredHackingSkill) {
        tags.push(server.requiredHackingSkill.toString());
    }
    if (show_organization) {
        tags.push(server.organizationName);
    }
    if (show_money && server.moneyAvailable) {
        tags.push(
            Intl.NumberFormat(undefined, {
                style: "currency",
                currency: "USD",
                currencyDisplay: "narrowSymbol",
                currencySign: "accounting",
                maximumFractionDigits: 3,
            }).format(server.moneyAvailable)
        );
    }
    if (show_root) {
        tags.push(server.hasAdminRights ? `ROOT` : `USER`);
    }

    if (tags.length > 0) {
        label += ` (${tags.join(` - `)})`;
    }

    ns.tprint(label);
}

function walk(ns: NS, host: string, prefix: string = ``) {
    const servers = ns.scan(host);
    if (host != `home`) {
        servers.shift();
    }

    for (let [index, next] of servers.entries()) {
        print_host(ns, prefix, next);
        const next_prefix =
            prefix + (index < servers.length - 1 ? `  |  ` : `     `);
        walk(ns, next, next_prefix);
    }
}

export async function main(ns: NS) {
    let host = `home`;
    const args: string[] = ns.args.filter(
        (a): a is string => typeof a === "string" && a[0] != `-`
    );
    if (args.length > 0) {
        host = args[0];
    }
    ns.tprint(host);
    walk(ns, host);
}
