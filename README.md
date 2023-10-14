# Bitburner Scripts

[![License](https://img.shields.io/github/license/Drakmyth/BitburnerScripts)](https://github.com/Drakmyth/BitburnerScripts/blob/master/LICENSE.md)
[![Game Version](https://img.shields.io/badge/game_version-2.5.0-blue)](https://github.com/bitburner-official/bitburner-src/releases/tag/v2.5.0)

This repository contains scripts I have written while playing the idle hacking game [Bitburner](https://store.steampowered.com/app/1812820/Bitburner/).

## Appliction Scripts

Application scripts will persistently run in the background and continue operating until terminated.

-   [contracts.app.js](contracts.app.js) - Finds and automatically solves contracts. Uses `known-servers.json.txt`. Update ContractType list to add new contract solvers.

-   [cracker.app.js](cracker.app.js) - Automatically cracks servers as cracking requirements are met. Uses `known-servers.json.txt`. Skips servers that cannot be cracked due to low hacking skill, missing port opener programs, or admin access already being available.

-   [flooder.app.js](flooder.app.js) - Monitors servers provided by `known-servers.json.txt`. For servers that the player has admin access to, this script will deploy and execute `weaken.daemon.js` against each server until it has reached its minimum security level at which point it will deploy and execute all three daemon scripts. Tries to identify a ratio of daemons so as to optimize keeping the money level high and the security level low while using as much ram on the target server as possible. If the target server is not able to be hacked (its max money is 0) it will use that server as a host (called a bot) to hack other servers. Every cycle of this script it will re-target all bots so as to simultaneously hack as many other servers as possible.

-   [hacknet.app.js](hacknet.app.js) - Automatically purchases and upgrades hacknet nodes. Will use up to 25% of the player's current money to buy a new hacknet node or the most expensive upgrade available.

-   [netmapper.app.js](netmapper.app.js) - Crawls the network to identify servers and stores its findings in `known-servers.json.txt`. This file is used by other application scripts to avoid having to walk the network to get a list of servers.

## Daemon Scripts

Daemon scripts are application scripts that execute continuous hack, grow, or weaken calls against a hostname, waiting for a delay period between each call. If the delay is -1, the call will be executed once and the script will terminate.

-   [hack.daemon.js](hack.daemon.js) - Executes hack against `HOST` waiting `DELAY` milliseconds between calls.

    -   ```
        $ run hack.daemon.js HOST DELAY
        ```

-   [grow.daemon.js](grow.daemon.js) - Executes grow against `HOST` waiting `DELAY` milliseconds between calls.

    -   ```
        $ run grow.daemon.js HOST DELAY
        ```

-   [weaken.daemon.js](weaken.daemon.js) - Executes weaken against `HOST` waiting `DELAY` milliseconds between calls.
    -   ```
        $ run weaken.daemon.js HOST DELAY
        ```

## Functional Scripts

Functional scripts are intended to be executed manually to display information or carry out simple interactions that generally are not desired to be continuous. They will terminate automatically once they have completed execution.

-   [init.js](init.js) - Executes a hardcoded list of application scripts. This makes restarting those scripts easier after installing augments. Waits 1 second between each script to allow any initialization to complete before starting the next service. Note that the scripts will be executed in order and if there is not enough RAM on the host server to run a script it will be skipped.

-   [map.js](map.js) - Displays a recursive network tree starting at `HOST` (if provided, otherwise "home").

    -   ```
        $ run map.js [OPTION] [HOST]

        Options:
        -l, --level             Show hacking skill required to hack server
        -m, --money             Show money available on each server
        -o, --organization      Show the organization name of each server
        -r, --root              Show user access level of each server
        ```

-   [servers.js](servers.js) - Purchases or upgrades servers to the maximum amount of RAM affordable. Always purchases maximum number of servers and keeps all server resources equivalent. Running scripts will be terminated before upgrade. Will only purchase servers able to concurrently run at least one thread of each daemon script.
    -   ```
        $ run servers.js [OPTION]

        Options:
        -s, --simulate          Simulates the upgrade process to display the required
                                cost without purchasing new servers or terminating
                                existing scripts.
        ```

## Library Scripts

Library scripts are not themselves executable, but contain functions or constants that are intended to be imported into other scripts.

-   [ports.lib.js](ports.lib.js) - Contains constants that define which ports to use for different purposes.

## Contract Solvers

Contract solvers are used by `contracts.app.js` to automatically complete contracts. Solvers should not be executed manually as they rely on having a second script listening on a port to receive the contract solution.

| Contract                                | Script                                                                                                     |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Algorithmic Stock Trader I              | [contracts/algorithmic-stock-trader.js](contracts/algorithmic-stock-trader.js)<sup>1</sup>                 |
| Algorithmic Stock Trader II             | [contracts/algorithmic-stock-trader.js](contracts/algorithmic-stock-trader.js)<sup>1</sup>                 |
| Algorithmic Stock Trader III            | [contracts/algorithmic-stock-trader.js](contracts/algorithmic-stock-trader.js)<sup>1</sup>                 |
| Algorithmic Stock Trader IV             | [contracts/algorithmic-stock-trader.js](contracts/algorithmic-stock-trader.js)<sup>1</sup>                 |
| Array Jumping Game                      | [contracts/array-jumping-game.js](contracts/array-jumping-game.js)                                         |
| Array Jumping Game II                   | [contracts/array-jumping-game-ii.js](contracts/array-jumping-game-ii.js)                                   |
| Compression I: RLE Compression          | [contracts/compression-i-rle-compression.js](contracts/compression-i-rle-compression.js)                   |
| Encryption I: Caesar Cipher             | [contracts/encryption-i-caesar-cipher.js](contracts/encryption-i-caesar-cipher.js)                         |
| Encryption II: Vigenère Cipher          | [contracts/encryption-ii-vigenere-cipher.js](contracts/encryption-ii-vigenere-cipher.js)                   |
| Find Largest Prime Factor               | [contracts/find-largest-prime-factor.js](contracts/find-largest-prime-factor.js)                           |
| Generate IP Addresses                   | [contracts/generate-ip-addresses.js](contracts/generate-ip-addresses.js)                                   |
| HammingCodes: Integer to encoded Binary | [contracts/hammingcodes-integer-to-encoded-binary.js](contracts/hammingcodes-integer-to-encoded-binary.js) |
| Merge Overlapping Intervals             | [contracts/merge-overlapping-intervals.js](contracts/merge-overlapping-intervals.js)                       |
| Minimum Path Sum in a Triangle          | [contracts/minimum-path-sum-in-a-triangle.js](contracts/minimum-path-sum-in-a-triangle.js)                 |
| Sanitize Parentheses in Expression      | [contracts/sanitize-parentheses-in-expression.js](contracts/sanitize-parentheses-in-expression.js)         |
| Spiralize Matrix                        | [contracts/spiralize-matrix.js](contracts/spiralize-matrix.js)                                             |
| Subarray with Maximum Sum               | [contracts/subarray-with-maximum-sum.js](contracts/subarray-with-maximum-sum.js)                           |
| Total Ways to Sum                       | [contracts/total-ways-to-sum.js](contracts/total-ways-to-sum.js)<sup>1</sup>                               |
| Total Ways to Sum II                    | [contracts/total-ways-to-sum.js](contracts/total-ways-to-sum.js)<sup>1</sup>                               |
| Unique Paths in a Grid I                | [contracts/unique-paths-in-a-grid.js](contracts/unique-paths-in-a-grid.js)<sup>1</sup>                     |
| Unique Paths in a Grid II               | [contracts/unique-paths-in-a-grid.js](contracts/unique-paths-in-a-grid.js)<sup>1</sup>                     |

<sup>1</sup> <small>Different difficulties of the same contract may in some cases be able to be solved by the same implementation. This usually requires slight pre-processing of the input for lower difficulties. This pre-processing is performed by `contracts.app.js` where applicable.</small>

## IDE Integration

These scripts can be copy-pasted into the game, or you can edit them in your editor of choice and have them update in the game automatically! This process used to be a lot easier due to the existence of an official VS Code extension, but that has sadly been deprecated in favor of a clunky build server approach.

This approach does have two significant advantages though:

1. Any IDE can benefit from full integration, not just VS Code
1. It enables the ability to write scripts using [TypeScript](https://www.typescriptlang.org)

Because it's a bit faster and more fully-featured, this repository is configured to use the unofficial [Viteburner](https://github.com/Tanimodori/viteburner) server rather than the official [bitburner-filesync](https://github.com/bitburner-official/bitburner-filesync) server. To host the contents of this repository using Viteburner:

1. Clone this repository
1. Start the Viteburner server
    ```
    $ npx viteburner
    ```
1. Inside the Bitburner game, in the left sidebar:
    1. Enable the Remote API by selecting `Options -> Remote API`
    1. Enter the port Viteburner is running on (should be `12525` by default and is displayed in the terminal after starting the server)
    1. Click the `Connect` button

See [viteburner-template](https://github.com/Tanimodori/viteburner-template) for information on configuring your own repository.

:warning: Note: If at any time the game is running and the server isn't, the Remote API will be disabled and you'll have to re-enable it manually. It will *NOT* be automatically enabled when starting the server. The server should be the first to start and the last to close..

## Enabling Intellisense

Viteburner will automatically add an up-to-date type definition file to the root directory. In your *.ts scripts you can then just import and reference all the Bitburner types directly. If you're still using *.js scripts and value your sanity, you should migrate to TypeScript! If you *really* want to keep using JavaScript, you'll need to add [JSDoc](https://jsdoc.app) comments above each function with a relative path to the types file.
```js
/** @param {import("../NetscriptDefinitions.d.ts").NS} ns */
export async function main(ns: NS) {
    ns.tprint(`Hello world!`);
}
```
This is because the types file does not expose the Bitburner types as globals or as namespaces. If you try to add those constructs to the `NetscriptDefinitions.d.ts` file manually Viteburner is going to overwrite it, so this is the only available option.

## License

These scripts are licensed under the MIT License (MIT). See LICENSE for details.
