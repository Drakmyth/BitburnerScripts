# Bitburner Scripts
[![License](https://img.shields.io/github/license/Drakmyth/BitburnerScripts)](https://github.com/Drakmyth/BitburnerScripts/blob/master/LICENSE.md)

This repository contains scripts I have written while playing the idle hacking game [Bitburner](https://store.steampowered.com/app/1812820/Bitburner/).

## Appliction Scripts
Application scripts will persistently run in the background and continue operating until terminated. Tail log will be opened automatically upon execution.

- [contracts.app.js](contracts.app.js) - Finds and automatically solves contracts. Uses `known-servers.json.txt`. Update ContractType list to add new contract solvers.

- [cracker.app.js](cracker.app.js) - Automatically cracks servers as cracking requirements are met. Uses `known-servers.json.txt`. Skips servers that cannot be cracked due to low hacking skill, missing port opener programs, or admin access already being available.

- [flooder.app.js](flooder.app.js) - Monitors servers provided by `known-servers.json.txt`. For servers that the player has admin access to, this script will deploy and execute `weaken.daemon.js` against each server until it has reached its minimum security level at which point it will deploy and execute all three daemon scripts. Tries to identify a ratio of daemons so as to optimize keeping the money level high and the security level low while using as much ram on the target server as possible. If the target server is not able to be hacked (its max money is 0) it will use that server as a host (called a bot) to hack other servers. Every cycle of this script it will re-target all bots so as to simultaneously hack as many other servers as possible.

- [hacknet.app.js](hacknet.app.js) - Automatically purchases and upgrades hacknet nodes. Will use up to 25% of the player's current money to buy a new hacknet node or the most expensive upgrade available.

- [netmapper.app.js](netmapper.app.js) - Crawls the network to identify servers and stores its findings in `known-servers.json.txt`. This file is used by other application scripts to avoid having to walk the network to get a list of servers.

## Daemon Scripts
Daemon scripts are application scripts that execute continuous hack, grow, or weaken calls against a hostname, waiting for a delay period between each call. If the delay is -1, the call will be executed once and the script will terminate.

- [hack.daemon.js](hack.daemon.js) - Executes hack against `HOST` waiting `DELAY` milliseconds between calls.
  - ```
    $ run hack.daemon.js HOST DELAY
    ```

- [grow.daemon.js](grow.daemon.js) - Executes grow against `HOST` waiting `DELAY` milliseconds between calls.
  - ```
    $ run grow.daemon.js HOST DELAY
    ```

- [weaken.daemon.js](weaken.daemon.js) - Executes weaken against `HOST` waiting `DELAY` milliseconds between calls.
  - ```
    $ run weaken.daemon.js HOST DELAY
    ```

## Functional Scripts
Functional scripts are intended to be executed manually to display information or carry out simple interactions that generally are not desired to be continuous. They will terminate automatically once they have completed execution.

- [init.js](init.js) - Executes a hardcoded list of application scripts. This makes restarting those scripts easier after installing augments. Waits 1 second between each script to allow any initialization to complete before starting the next service. Note that the scripts will be executed in order and if there is not enough RAM on the host server to run a script it will be skipped.

- [map.js](map.js) - Displays a recursive network tree starting at `HOST` (if provided, otherwise "home").
  - ```
    $ run map.js [OPTION] [HOST]
    
    Options:
    -l, --level             Show hacking skill required to hack server
    -m, --money             Show money available on each server
    -o, --organization      Show the organization name of each server
    -r, --root              Show user access level of each server
    ```

- [servers.js](servers.js) - Purchases or upgrades servers to the maximum amount of RAM affordable. Always purchases maximum number of servers and keeps all server resources equivalent. Running scripts will be terminated before upgrade. Will only purchase servers able to concurrently run at least one thread of each daemon script.
  - ```
    $ run servers.js [OPTION]
    
    Options:
    -s, --simulate          Simulates the upgrade process to display the required
                            cost without purchasing new servers or terminating
                            existing scripts.
    ```

## Library Scripts
Library scripts are not themselves executable, but contain functions or constants that are intended to be imported into other scripts.

- [ports.lib.js](ports.lib.js) - Contains constants that define which ports to use for different purposes.

## Contract Solvers
Contract solvers are used by `contracts.app.js` to automatically complete contracts. Each solver includes a `.test.js` file that can be executed to run various payloads against it to ensure the solver is working properly. The solvers should not be executed manually except through these test scripts as they rely on having a second script listening on a port to receive the contract solution. Test cases are copied from https://github.com/phantomesse/bitburner/tree/main/tests unless otherwise noted in the test file.

| Contract                                | Script                                                                                                     |
|-----------------------------------------|------------------------------------------------------------------------------------------------------------|
| Algorithmic Stock Trader I              | [contracts/algorithmic-stock-trader.js](contracts/algorithmic-stock-trader.js)<sup>1</sup>                 |
| Algorithmic Stock Trader II             | [contracts/algorithmic-stock-trader.js](contracts/algorithmic-stock-trader.js)<sup>1</sup>                 |
| Algorithmic Stock Trader III            | [contracts/algorithmic-stock-trader.js](contracts/algorithmic-stock-trader.js)<sup>1</sup>                 |
| Algorithmic Stock Trader IV             | [contracts/algorithmic-stock-trader.js](contracts/algorithmic-stock-trader.js)<sup>1</sup>                 |
| Array Jumping Game                      | [contracts/array-jumping-game.js](contracts/array-jumping-game.js)                                         |
| Array Jumping Game II                   | [contracts/array-jumping-game-ii.js](contracts/array-jumping-game-ii.js)                                   |
| Find Largest Prime Factor               | [contracts/find-largest-prime-factor.js](contracts/find-largest-prime-factor.js)                           |
| Generate IP Addresses                   | [contracts/generate-ip-addresses.js](contracts/generate-ip-addresses.js)                                   |
| HammingCodes: Integer to encoded Binary | [contracts/hammingcodes-integer-to-encoded-binary.js](contracts/hammingcodes-integer-to-encoded-binary.js) |
| Merge Overlapping Intervals             | [contracts/merge-overlapping-intervals.js](contracts/merge-overlapping-intervals.js)                       |
| Minimum Path Sum in a Triangle          | [contracts/minimum-path-sum-in-a-triangle.js](contracts/minimum-path-sum-in-a-triangle.js)                 |
| Spiralize Matrix                        | [contracts/spiralize-matrix.js](contracts/spiralize-matrix.js)                                             |
| Subarray with Maximum Sum               | [contracts/subarray-with-maximum-sum.js](contracts/subarray-with-maximum-sum.js)                           |
| Total Ways to Sum                       | [contracts/total-ways-to-sum.js](contracts/total-ways-to-sum.js)<sup>1</sup>                               |
| Total Ways to Sum II                    | [contracts/total-ways-to-sum.js](contracts/total-ways-to-sum.js)<sup>1</sup>                               |
| Unique Paths in a Grid I                | [contracts/unique-paths-in-a-grid.js](contracts/unique-paths-in-a-grid.js)<sup>1</sup>                     |
| Unique Paths in a Grid II               | [contracts/unique-paths-in-a-grid.js](contracts/unique-paths-in-a-grid.js)<sup>1</sup>                     |

<sup>1</sup> <small>Different difficulties of the same contract may in some cases be able to be solved by the same implementation. This usually requires slight pre-processing of the input for lower difficulties. This pre-processing is performed by `contracts.app.js` where applicable.</small>

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
