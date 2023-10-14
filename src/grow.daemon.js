/** @param {NS} ns **/
export async function main(ns) {
    const host = ns.args[0];
    const delay = ns.args[1];

    while (true) {
        await ns.sleep(delay);
        await ns.grow(host);

        if (delay < 0) {
            break;
        }
    }
}
