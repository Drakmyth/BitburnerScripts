/** @param {NS} ns **/
function findServers(ns, current, knownServers) {
    let hosts = ns.scan(current.hostname);
    if (current.hostname !== `home`) {
        hosts.shift();
    }
    let servers = hosts.map(host => ns.getServer(host));
    for (let server of servers) {
        let index = knownServers.findIndex(s => server.hostname === s.hostname);
        if (index < 0){
            ns.print(`Found: ${server.hostname}`);
            knownServers.push(server);
        } else {
            knownServers.splice(index, 1, server);
        }
        findServers(ns, server, knownServers);
    }
}

/** @param {NS} ns **/
export async function main(ns) {
    ns.tail();
    ns.disableLog(`ALL`);
    let filename = `known-servers.json`;
    let tenMinutes = 1000 * 60 * 10;
    let servers = [];

    if (ns.fileExists(filename)) {
        ns.rm(filename);
        ns.print(`Deleted existing ${filename}`);
    }

    let lastServerCount = servers.length;

    while(true) {
        ns.print(`\nSearching for new servers...`);
        findServers(ns, `home`, servers);

        if (lastServerCount === servers.length) {
            ns.print(`No new servers found.`);
        }
        lastServerCount = servers.length;
        ns.print(`Writing ${filename}...`);
        await ns.write(filename, JSON.stringify(servers), `w`);
        ns.print(`Will search again in 10 minutes.`);
        await ns.sleep(tenMinutes);
    }
}
