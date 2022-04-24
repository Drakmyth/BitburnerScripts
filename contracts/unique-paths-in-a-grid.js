// Unique Paths in a Grid
// Unique Paths in a Grid II

/** @param {NS} ns */
export async function main(ns) {
    const input = JSON.parse(ns.args[0]);
    const responsePort = ns.args[1];
    ns.print(`Input: ${JSON.stringify(input)}`);

    const rows = input.length;
    const cols = input[0].length;

    const grid = new Array(rows).fill(new Array(cols));
    grid[rows - 1][cols - 1] = 1;

    for (let y = rows - 1; y >= 0; y--) {
        for (let x = cols - 1; x >= 0; x--) {
            if (y === rows - 1 && x === cols - 1) continue;
            if (input[y][x] === 1) {
                grid[y][x] = 0;
                continue;
            }

            let val = 0;
            if (y < rows - 1) {
                val += grid[y + 1][x];
            }
            if (x < cols - 1) {
                val += grid[y][x + 1];
            }
            grid[y][x] = val;
        }
    }

    const answer = grid[0][0];
    ns.print(`Number of unique paths is ${answer}`);
    ns.writePort(responsePort, JSON.stringify(answer));
}
