import * as log from "log.lib.js";

/** @param {NS} ns **/
function find_hosts(ns, current="home", all_hosts=new Set()) {
    let hosts = ns.scan(current);
    if (current != "home") {
        hosts.shift();
    }
    log.verbose(ns, "<" + current + "> Found: " + hosts.length + " - " + hosts.toString())
    for (let host of hosts) {
        if (all_hosts.has(host)) continue;
        all_hosts.add(host);
        find_hosts(ns, host, all_hosts);
    }
    
    return all_hosts
}

/** @param {NS} ns **/
export async function main(ns) {
    let daemon = "daemon.js"
    let daemon_ram = ns.getScriptRam(daemon);
    let hosts = find_hosts(ns);
    log.info(ns, hosts);

    for (let host of hosts) {
        log.verbose(ns, "Host: " + host);
        if (!ns.scriptRunning(daemon, host)) {
            let cracked = await crack_host(ns, host);
            log.verbose(ns, "Host cracked: " + cracked);
            if (! cracked) continue;
            log.verbose(ns, "Uploading daemon to host...");
            await ns.scp(daemon, "home", host);
            log.verbose(ns, "Upload complete");
            let thread_count = Math.floor(ns.getServerMaxRam(host) / daemon_ram);
            log.verbose(ns, "Killing existing processes...");
            ns.killall(host);
            log.verbose(ns, "Running daemon on host...");
            if (thread_count > 0) {
                ns.exec(daemon, host, thread_count, host);
                log.verbose(ns, "Daemon running\n");
            }
        }
    }
}

/** @param {NS} ns **/
async function crack_host(ns, host) {
    let server = ns.getServer(host);
    let rootAccess = ns.hasRootAccess(host);
    log.verbose(ns, "Admin: " + rootAccess);
    if (rootAccess) return true;

    log.verbose(ns, "Ports: " + server.openPortCount + "/" + server.numOpenPortsRequired);
    if (server.numOpenPortsRequired > 3) {
        log.verbose(ns, "Can't open enough ports. Skipping...");
        return false;
    }

    while (server.openPortCount < server.numOpenPortsRequired) {
        if (! server.sshPortOpen && ns.fileExists("brutessh.exe")) {
            log.verbose(ns, "Opening SSH port...");
            ns.brutessh(host);
        } else if (! server.ftpPortOpen && ns.fileExists("ftpcrack.exe")) {
            log.verbose(ns, "Opening FTP port...");
            ns.ftpcrack(host);
        } else if (! server.smtpPortOpen && ns.fileExists("relaysmtp.exe")) {
            log.verbose(ns, "Opening SMTP port...");
            ns.relaysmtp(host);
        } else {
            log.verbose(ns, "Can't open more ports.");
            break;
        }
        await ns.sleep(1000);
        server = ns.getServer(host);
    }

    if (server.openPortCount >= server.numOpenPortsRequired) {
        log.verbose(ns, "Nuking...");
        ns.nuke(host);
        return true;
    }

    return false;
}
