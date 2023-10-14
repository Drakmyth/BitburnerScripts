// Proper 2-Coloring of a Graph

import { NS } from "@ns";

class Edge {
    constructor(public v0: number, public v1: number) {
        this.v0 = Math.min(v0, v1);
        this.v1 = Math.max(v0, v1);
    }
}

export async function main(ns: NS) {
    const input: [number, [number, number][]] = JSON.parse(
        ns.args[0] as string
    );
    const responsePort = ns.args[1] as number;
    const vertCount = input[0];
    const edges = get_unique_edges(input[1]);
    let colors = new Array<number | undefined>(vertCount).fill(undefined);
    colors[0] = 0;

    ns.print(`Vertices: ${vertCount}`);
    ns.print(`Edges: ${JSON.stringify(edges)}`);

    while (true) {
        let edge = edges.find(
            (e) => typeof colors[e.v0] !== typeof colors[e.v1]
        );
        if (edge === undefined) {
            edge = edges.find(
                (e) => colors[e.v0] === undefined && colors[e.v1] === undefined
            );
            if (edge === undefined) break;
            colors[edge.v0] = 0;
        }

        ns.print(`Edge: (${edge.v0}, ${edge.v1})`);

        const newVert = colors[edge.v0] === undefined ? edge.v0 : edge.v1;
        const oldVert = colors[edge.v0] === undefined ? edge.v1 : edge.v0;
        const lastColor = colors[oldVert];
        const nextColor = lastColor === 0 ? 1 : 0;

        const found_conflict = edges
            .filter((e) => e !== edge && (e.v0 === newVert || e.v1 === newVert))
            .some((e) => {
                const otherVert = e.v0 === newVert ? e.v1 : e.v0;
                return colors[otherVert] === nextColor;
            });

        if (found_conflict) {
            colors = [];
            break;
        }

        colors[newVert] = nextColor;
        ns.print(colors);
    }

    colors = colors.map((c) => (c === undefined ? 0 : c));

    ns.print(`Colors: ${JSON.stringify(colors)}`);
    ns.writePort(responsePort, JSON.stringify(colors));
}

function get_unique_edges(input: [number, number][]) {
    const unique_edges: Edge[] = [];
    input
        .map((e) => new Edge(e[0], e[1]))
        .forEach((e) => {
            if (!unique_edges.some((ue) => e.v0 === ue.v0 && e.v1 === ue.v1)) {
                unique_edges.push(e);
            }
        });

    return unique_edges;
}
