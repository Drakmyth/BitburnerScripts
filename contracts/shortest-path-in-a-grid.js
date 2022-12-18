// Shortest Path in a Grid

class Cell {
    constructor(code, x, y) {
        this.code = code;
        this.x = x;
        this.y = y;
    }
}

/** @param {NS} ns */
export async function main(ns) {
    const input = JSON.parse(ns.args[0]);
    const responsePort = ns.args[1];
    ns.print(`Input: ${JSON.stringify(input)}`);

    const map = build_distance_map(input);
    const answer = get_shortest_path(input, map);

    ns.print(`Shortest path is ${JSON.stringify(answer)}`);
    ns.writePort(responsePort, JSON.stringify(answer));
}

function build_distance_map(grid) {
    const width = grid[0].length;
    const height = grid.length;
    const max_size = width * height;
    const map = Array(height).fill(null).map(() => Array(width).fill(-1));

    const unvisited_cells = [new Cell(`?`, width - 1, height - 1)];
    let firstCell = true;

    while(unvisited_cells.length > 0) {
        const cell = unvisited_cells.pop();

        const neighbors = get_adjacent_cells(grid, cell.x, cell.y);
        const visited_neighbors = neighbors.filter(n => map[n.y][n.x] > -1);
        const unvisited_neighbors = neighbors.filter(n => map[n.y][n.x] === -1);

        if (firstCell) {
            map[cell.y][cell.x] = 0;
            firstCell = false;
        } else {
            map[cell.y][cell.x] = visited_neighbors.reduce((min_dist, n) => Math.min(min_dist, map[n.y][n.x]), max_size) + 1;
        }

        unvisited_cells.push(...unvisited_neighbors);

        const revisit = visited_neighbors.filter(n => map[n.y][n.x] > map[cell.y][cell.x]);
        unvisited_cells.push(...revisit);
    }

    return map;
}

function get_adjacent_cells(grid, x, y) {
    const width = grid[0].length;
    const height = grid.length;

    const up = new Cell(`U`, x, y - 1);
    const down = new Cell(`D`, x, y + 1);
    const left = new Cell(`L`, x - 1, y);
    const right = new Cell(`R`, x + 1, y);

    const cells = [up, down, left, right];
    const adjacent_cells = [];

    for (let cell of cells) {
        if (cell.x < 0) continue;
        if (cell.y < 0) continue;
        if (cell.x > width - 1) continue;
        if (cell.y > height - 1) continue;
        if (grid[cell.y][cell.x] === 1) continue;

        adjacent_cells.push(cell);
    }

    return adjacent_cells;
}

function get_shortest_path(grid, map) {
    let answer = ``;
    let pos = [0, 0];

    while (true) {
        const x = pos[0];
        const y = pos[1];

        const distance = map[y][x];
        if (distance <= 0) return answer;

        const adjacent_cells = get_adjacent_cells(grid, x, y);
        const next_cell = adjacent_cells.reduce((min_cell, cell) => {
            const cell_dist = map[cell.y][cell.x];
            const min_cell_dist = map[min_cell.y][min_cell.x];

            return cell_dist < min_cell_dist ? cell : min_cell;
        });

        answer += next_cell.code;
        pos = [next_cell.x, next_cell.y];
    }
}
