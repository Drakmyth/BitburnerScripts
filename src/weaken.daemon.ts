import { NS } from "@ns";

export async function main(ns: NS) {
    const host = ns.args[0] as string;
    const delay = ns.args[1] as number;

    while (true) {
        await ns.sleep(delay);
        await ns.weaken(host);

        if (delay < 0) {
            break;
        }
    }
}
