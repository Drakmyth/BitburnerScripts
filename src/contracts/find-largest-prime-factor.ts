// Find Largest Prime Factor

import { NS } from "@ns";

export async function main(ns: NS) {
    const input: number = JSON.parse(ns.args[0] as string);
    const responsePort = ns.args[1] as number;
    ns.print(`Input: ${input}`);

    let answer = input;
    for (let i = 2; i < input / 2; i++) {
        const candidate = input / i;
        if (input % i === 0) {
            let prime = true;
            for (let j = 2; j < candidate / 2; j++) {
                if (candidate % j === 0) {
                    prime = false;
                    break;
                }
            }

            if (prime) {
                answer = candidate;
                break;
            }
        }
    }

    ns.print(`Maximum prime factor is ${answer}`);
    ns.writePort(responsePort, JSON.stringify(answer));
}
