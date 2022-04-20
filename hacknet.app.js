class Upgrade {
    constructor(type, node, cost, func) {
        this.type = type;
        this.node = node;
        this.cost = cost;
        this.func = func;
    }
}

/** @param {NS} ns **/
export async function main(ns) {
    ns.disableLog(`ALL`);
    while (true) {
        const maximumCost = ns.getPlayer().money * 0.25;
        const purchaseUpgrade = new Upgrade(`purchase`, -1, ns.hacknet.getPurchaseNodeCost(), () => { ns.hacknet.purchaseNode() });
        let bestUpgrade = new Upgrade(`none`, -1, 0, async () => { await ns.sleep(5000); });

        const ownedNodes = ns.hacknet.numNodes();
        if (ownedNodes < 1 && purchaseUpgrade.cost < maximumCost) {
            bestUpgrade = purchaseUpgrade;
        }

        for (let i = 0; i < ownedNodes; i++) {
            const upgrades = [
                purchaseUpgrade,
                new Upgrade(`level`, i, ns.hacknet.getLevelUpgradeCost(i, 1), () => ns.hacknet.upgradeLevel(i, 1)),
                new Upgrade(`ram`, i, ns.hacknet.getRamUpgradeCost(i, 1), () => ns.hacknet.upgradeRam(i, 1)),
                new Upgrade(`cores`, i, ns.hacknet.getCoreUpgradeCost(i, 1), () => ns.hacknet.upgradeCore(i, 1))
            ];

            for (let upgrade of upgrades) {
                if (upgrade.cost < maximumCost && upgrade.cost > bestUpgrade.cost) {
                    bestUpgrade = upgrade;
                }
            }
        }

        await bestUpgrade.func();
        if (bestUpgrade.type === `purchase`) {
            ns.print(`Purchased node for ${ns.nFormat(bestUpgrade.cost, `($0.000a)`)}.`);
        } else if (bestUpgrade.type !== `none`) {
            ns.print(`Upgraded hacknet-node-${bestUpgrade.node} ${bestUpgrade.type} for ${ns.nFormat(bestUpgrade.cost, `($0.000a)`)}.`);
        }
    }
}
