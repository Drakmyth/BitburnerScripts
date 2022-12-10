// Proper 2-Coloring of a Graph

/** @param {NS} ns */
export async function main(ns) {
    const input = JSON.parse(ns.args[0]);
    const responsePort = ns.args[1];
    const vertCount = input[0];
    const edges = input[1];
    let colors = new Array(vertCount).fill(undefined);

    ns.print(`Vertices: ${vertCount}`);
    ns.print(`Edges: ${JSON.stringify(edges)}`);

    let currentVert = 0;
    do {
        const adjVerts = edges.filter(e => e.indexOf(currentVert) > -1).map(e => e[0] === currentVert ? e[1] : e[0]);
        const adj0 = adjVerts.some(v => colors[v] === 0);
        const adj1 = adjVerts.some(v => colors[v] === 1);
        
        if (adj0 && adj1) {
            colors = [];
            break;
        }
        else if (adj0 && !adj1) colors[currentVert] = 1
        else colors[currentVert] = 0
        
        let cv = currentVert;
        const nextVert = adjVerts.find(v => colors[v] === undefined);
        currentVert = nextVert === undefined ? colors.indexOf(undefined) : nextVert;
    }
    while (currentVert > -1);

    ns.print(`Colors: ${JSON.stringify(colors)}`);
    ns.writePort(responsePort, JSON.stringify(colors));
}
