// Proper 2-Coloring of a Graph

/** @param {NS} ns */
export async function main(ns) {
    const input = JSON.parse(ns.args[0]);
    const responsePort = ns.args[1];
    const vertCount = input[0];
    const edges = input[1];
    let colors = new Array(vertCount).fill(undefined);
    colors[0] = 0;

    ns.print(`Vertices: ${vertCount}`);
    ns.print(`Edges: ${JSON.stringify(edges)}`);

    let nextEdge = undefined;
    while (true) {
        nextEdge = edges.find(e => typeof(colors[e[0]]) !== typeof(colors[e[1]]));
        if (nextEdge === undefined) break;

        const v0 = nextEdge[0];
        const v1 = nextEdge[1];
        const lastColor = colors[v0] === undefined ? colors[v1] : colors[v0];
        const nextColor = lastColor === 0 ? 1 : 0;
        
        if (colors[v0] === undefined) {
            colors[v0] = nextColor;
        } else {
            colors[v1] = nextColor;
        }
        ns.print(colors);
    }

    ns.print(`Colors: ${JSON.stringify(colors)}`);
    ns.writePort(responsePort, JSON.stringify(colors));
}
