// Encryption II: Vigenère Cipher

/** @param {NS} ns */
export async function main(ns) {
    const input = JSON.parse(ns.args[0]);
    const responsePort = ns.args[1];
    const str = input[0];
    const keyword = input[1];
    ns.print(`Input: ${str}`);
    ns.print(`Keyword: ${keyword}`);

    let fullkeyword = keyword;
    for (let i = fullkeyword.length; i < str.length; i++) {
        fullkeyword += keyword[i % keyword.length];
    }

    ns.print(`Full Keyword: ${fullkeyword}`);

    const chars = `ABCDEFGHIJKLMNOPQRSTUVWXYZ`;

    let answer = ``;
    for (let i = 0; i < str.length; i++) {
        const shift = chars.indexOf(str[i]); 
        const end = (chars.indexOf(fullkeyword[i]) + shift) % chars.length;
        
        answer += chars[end];
    }

    ns.print(`Output: ${answer}`);
    ns.writePort(responsePort, JSON.stringify(answer));
}
