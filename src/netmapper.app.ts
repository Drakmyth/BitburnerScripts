import { NS, Server } from "@ns";

function findServers(ns: NS, current: Server, knownServers: Server[]) {
    const hosts = ns.scan(current.hostname);
    if (current.hostname !== `home`) {
        hosts.shift();
    }

    const servers = hosts.map((host) => ns.getServer(host));
    for (let server of servers) {
        const index = knownServers.findIndex(
            (s) => server.hostname === s.hostname
        );
        if (index < 0) {
            ns.print(`Found: ${server.hostname}`);
            knownServers.push(server);
        } else {
            knownServers.splice(index, 1, server);
        }
        findServers(ns, server, knownServers);
    }
}

export async function main(ns: NS) {
    ns.disableLog(`ALL`);
    const filename = `known-servers.json.txt`;
    const tenMinutes = 1000 * 60 * 10;
    const servers: Server[] = [];

    if (ns.fileExists(filename)) {
        ns.rm(filename);
        ns.print(`Deleted existing ${filename}`);
    }

    let lastServerCount = servers.length;

    while (true) {
        ns.print(`\nSearching for new servers...`);
        findServers(ns, ns.getServer(`home`), servers);

        if (lastServerCount === servers.length) {
            ns.print(`No new servers found.`);
        }
        lastServerCount = servers.length;
        ns.print(`Writing ${filename}...`);
        ns.write(filename, JSON.stringify(servers), `w`);
        ns.print(
            `Will search again at ${new Date(
                Date.now() + tenMinutes
            ).toLocaleTimeString(undefined, { hour12: false })}.`
        );
        await ns.sleep(tenMinutes);
    }
}
