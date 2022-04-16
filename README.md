# Bitburner Scripts
[![License](https://img.shields.io/github/license/Drakmyth/BitburnerScripts)](https://github.com/Drakmyth/BitburnerScripts/blob/master/LICENSE.md)

This repository contains scripts I have written while playing the idle hacking game [Bitburner](https://store.steampowered.com/app/1812820/Bitburner/).

## Appliction Scripts
Application scripts will persistently run in the background and continue operating until terminated. Tail log will be opened automatically upon execution.

- [contracts.app.js](contracts.app.js) - Finds and automatically solves contracts. Uses `known-servers.json.txt`. Update ContractType list to add new contract solvers.

- [cracker.app.js](cracker.app.js) - Automatically cracks servers as cracking requirements are met. Uses `known-servers.json.txt`. Skips servers that cannot be cracked due to low hacking skill, missing port opener programs, or admin access already being available.

- [hacknet.app.js](hacknet.app.js) - Automatically purchases and upgrades hacknet nodes. Will use up to 25% of the player's current money to buy a new hacknet node or the most expensive upgrade available.

- [netmapper.app.js](netmapper.app.js) - Crawls the network to identify servers and stores its findings in `known-servers.json.txt`. This file is used by other application scripts to avoid having to walk the network to get a list of servers.

## Functional Scripts
Functional scripts are scripts that are either facilitate automation or are intended to be executed directly to display information. They will terminate automatically once they have completed execution.

### daemon.js
```
$ run daemon.js <HOST>

Executes a weaken-grow-hack loop against HOST. Available money threshold 75% of
maximum money. Security threshold is minimum security level + 5.
```

### dbot.js
```
$ run dbot.js

A variant of daemon.js that crawls the network looking for servers with at least
75% of their maximum money, and will weaken and hack those servers that it finds.
Where daemon.js is often used to cause a server to hack itself, dbot.js is used
on servers that do not have their own money to hack to enable those servers to hack
others.
```

### flood.js
```
$ run flood.js [OPTION]

Recursively deploys and executes either daemon.js or dbot.js (depending on the
server's maximum money) to all servers on the network. Will automatically crack
servers to gain root access. If a server is unable to be cracked, it will be
skipped. Already existing instances of daemon.js and dbot.js will be replaced
with the latest versions.

Options:
-v, --verbose           Print extra detailed logging
```

### init.js
```
$ run init.js

Executes a hardcoded list of application scripts. This makes restarting those scripts
easier after installing augments. Waits 1 second between each script to allow any
initialization to complete before starting the next service.
```

### map.js
```
$ run map.js [OPTION] [HOST]

Displays a recursive network tree starting at HOST (if provided, otherwise "home").

Options:
-l, --level             Show hacking skill required to hack server
-m, --money             Show money available on each server
-o, --organization      Show the organization name of each server
-r, --root              Show user access level of each server
```

### servers.js
```
$ run servers.js [OPTION]

Purchases or upgrades servers to the maximum amount of RAM affordable. Always
purchases maximum number of servers and keeps all server resources equivalent.
Running scripts will be terminated before upgrade. Will only purchase servers
able to run at least one thread of daemon.js.

Options:
-s, --simulate          Simulates the upgrade process to display the required
                        cost without purchasing new servers or terminating
                        existing scripts.
```

## Library Scripts
Library scripts are not themselves executable, but contain functions or constants that are intended to be imported into other scripts.

- [log.lib.js](log.lib.js) - **DEPRECATED** - Contains functions to simplify providing verbose logging without clogging up the terminal. Adds `-v` and `--verbose` flags to scripts that import this library. Intended to be imported in its entirety. No longer useful as functional scripts are being transitioned to application scripts which allows use of `ns.print` to not flood the terminal.

  - Example:
    ```js
    import * as log from "log.lib.js";

    /** @param {NS} ns **/
    export async function main(ns) {
        log.info(`This will always print to terminal.`)
        log.verbose(`This will only print if -v or --verbose are provided.`)
    }
    ```

- [ports.lib.js](ports.lib.js) - Contains constants that define which ports to use for different purposes.

## Contract Solvers
Contract solvers are used by `contracts.app.js` to automatically complete contracts. Each solver includes a `.test.js` file that can be executed to run various payloads against it to ensure the solver is working properly. The solvers should not be executed manually except through these test scripts as they rely on having a second script listening on a port to receive the contract solution.



| Contract                                | Script                                                                                                     |
|-----------------------------------------|------------------------------------------------------------------------------------------------------------|
| Algorithmic Stock Trader I              | [contracts/algorithmic-stock-trader.js](contracts/algorithmic-stock-trader.js)<sup>1</sup>                 |
| Algorithmic Stock Trader II             | [contracts/algorithmic-stock-trader.js](contracts/algorithmic-stock-trader.js)<sup>1</sup>                 |
| Algorithmic Stock Trader III            | [contracts/algorithmic-stock-trader.js](contracts/algorithmic-stock-trader.js)<sup>1</sup>                 |
| Algorithmic Stock Trader IV             | [contracts/algorithmic-stock-trader.js](contracts/algorithmic-stock-trader.js)<sup>1</sup>                 |
| Array Jumping Game                      | [contracts/array-jumping-game.js](contracts/array-jumping-game.js)                                         |
| Find Largest Prime Factor               | [contracts/find-largest-prime-factor.js](contracts/find-largest-prime-factor.js)                           |
| HammingCodes: Integer to encoded Binary | [contracts/hammingcodes-integer-to-encoded-binary.js](contracts/hammingcodes-integer-to-encoded-binary.js) |
| Merge Overlapping Intervals             | [contracts/merge-overlapping-intervals.js](contracts/merge-overlapping-intervals.js)                       |
| Minimum Path Sum in a Triangle          | [contracts/minimum-path-sum-in-a-triangle.js](contracts/minimum-path-sum-in-a-triangle.js)                 |
| Spiralize Matrix                        | [contracts/spiralize-matrix.js](contracts/spiralize-matrix.js)                                             |
| Subarray with Maximum Sum               | [contracts/subarray-with-maximum-sum.js](contracts/subarray-with-maximum-sum.js)                           |
| Total Ways to Sum                       | [contracts/total-ways-to-sum.js](contracts/total-ways-to-sum.js)                                           |
| Unique Paths in a Grid I                | [contracts/unique-paths-in-a-grid-i.js](contracts/unique-paths-in-a-grid-i.js)                             |

<sup>1</sup> <small>All four Algorithmic Stock Trader (AST) contracts use the same script. The solver for AST IV is capable of solving all previous levels of this contract, so the inputs of AST I, II, and III are transformed by `contracts.app.js` to treat them all like AST IV.</small>

## Visual Studio Code Integration
These scripts can be copy-pasted into the game, or you can edit them in VS Code and have them update in the game automatically!

1. Install the [Bitburner VSCode Integration](https://marketplace.visualstudio.com/items?itemName=bitburner.bitburner-vscode-integration) extension
1. Inside the Bitburner game, in the top menu bar:
    1. Enable the API Server by selecting `API Server -> Enable Server`
    1. Enable Autostart by selecting `API Server -> Autostart` so this works automatically on whenever you open the game
    1. Select `API Server -> Copy Auth Token` to copy the authentication token to your clipboard
1. In this directory create a `.vscode/settings.json` file with the following contents
    ```json
    {
        "bitburner.authToken": "<YOUR_AUTH_TOKEN_HERE>",
        "bitburner.scriptRoot": ".",
        "bitburner.fileWatcher.enable": true,
        "bitburner.showPushSuccessNotification": true,
        "bitburner.showFileWatcherEnabledNotification": true,
    }
    ```

Additional information is available in the [bitburner-vscode](https://github.com/bitburner-official/bitburner-vscode) repository.

## Enabling Intellisense
This repository is set up to enable Intellisense for the NS global object used in the various game scripts. However, I don't want to include that file here as it is part of the base game. To enabled Intellisense, follow these steps:

1. Download [NetscriptDefinitions.d.ts](https://github.com/danielyxie/bitburner/blob/dev/src/ScriptEditor/NetscriptDefinitions.d.ts) into the root folder
1. Add `declare global { const NS: NS; }` before the first line in that file
1. Add `"javascript.preferences.importModuleSpecifier": "non-relative"` to your `.vscode/settings.json` file

## License

These scripts are licensed under the MIT License (MIT). See LICENSE for details.
