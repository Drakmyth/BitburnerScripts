// Sanitize Parentheses in Expression

function generateVariants(str, char) {
    const variants = new Set();
    const matchStr = new RegExp(`\\${char}`, `g`);
    const matches = [...str.matchAll(matchStr)];
    for (let match of matches) {
        variants.add(
            `${str.slice(0, match.index)}${str.slice(match.index + 1)}`
        );
    }
    return variants;
}

/** @param {NS} ns */
export async function main(ns) {
    const input = JSON.parse(ns.args[0])
        .replace(/^\)+/, ``)
        .replace(/\(+$/, ``);
    const responsePort = ns.args[1];
    ns.print(`Input: ${input}`);

    // Fix Closes
    let opens = 0;
    const heads = [];

    const firstChar = input.charAt(0);
    if (firstChar === "(") opens++;
    heads.push(firstChar);

    for (let i = 1; i < input.length; i++) {
        const char = input.charAt(i);

        if (char === `)` && opens <= 0) {
            const newHeads = new Set();
            for (let head of heads) {
                generateVariants(`${head}${char}`, char).forEach((v) =>
                    newHeads.add(v)
                );
            }
            heads.splice(0, heads.length, ...newHeads);
            continue;
        }

        if (char === `)`) opens--;
        if (char === `(`) opens++;

        heads.splice(0, heads.length, ...heads.map((h) => `${h}${char}`));
    }

    const answers = [];

    // Fix Opens
    for (let head of heads) {
        let closes = 0;
        const tails = [];

        const lastChar = head.charAt(head.length - 1);
        if (lastChar === ")") closes++;
        tails.push(lastChar);

        for (let i = head.length - 2; i >= 0; i--) {
            const char = head.charAt(i);

            if (char === `(` && closes <= 0) {
                const newTails = new Set();
                for (let tail of tails) {
                    generateVariants(`${char}${tail}`, char).forEach((v) =>
                        newTails.add(v)
                    );
                }
                tails.splice(0, tails.length, ...newTails);
                continue;
            }

            if (char === `(`) closes--;
            if (char === `)`) closes++;

            tails.splice(0, tails.length, ...tails.map((t) => `${char}${t}`));
        }

        answers.push(...tails);
    }

    ns.print(`Sanitized expressions: ${JSON.stringify(answers)}`);
    ns.writePort(responsePort, JSON.stringify(answers));
}
