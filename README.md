# Bitburner Scripts
[![License](https://img.shields.io/github/license/Drakmyth/BitburnerScripts)](https://github.com/Drakmyth/BitburnerScripts/blob/master/LICENSE.md)

This repository contains scripts I have written while playing the idle hacking game [Bitburner](https://store.steampowered.com/app/1812820/Bitburner/). Scripts are divided into three types: `Application Scripts`, `Functional Scripts` and `Library Scripts`.

## Appliction Scripts
Application scripts will persistently run in the background and continue operating until terminated. Use `tail` to observe the logs of a script for status.

### hacknet.app.js
```
$ run hacknet.app.js

Automatically purchases or upgrades hacknet nodes. Will continuously buy the most
expensive upgrade available or a new hacknet node that costs less than 25% of the
player's current money.
```

## Functional Scripts
Functional scripts are scripts that are either facilitate automation or are intended to be executed directly to display information. They will terminate automatically once they have completed execution.

### contracts.js
```
$ run contracts.js [HOST]

Crawls the network to find coding contracts and prints what it finds to the
terminal. HOST defaults to `home` if not provided.
```

### contracts/ajg.js
```
$ run contracts/ajg.js HOST FILENAME

Solves and submits the answer for the `Array Jumping Game` contract.
```

### contracts/ast1.js
```
$ run contracts/ast1.js HOST FILENAME

Solves and submits the answer for the `Algorithmic Stock Trader I` contract.
```

### contracts/ast2.js
```
$ run contracts/ast2.js HOST FILENAME

Solves and submits the answer for the `Algorithmic Stock Trader II` contract.
```

### contracts/moi.js
```
$ run contracts/moi.js HOST FILENAME

Solves and submits the answer for the `Merge Overlapping Intervals` contract.
```

### contracts/mpst.js
```
$ run contracts/mpst.js HOST FILENAME

Solves and submits the answer for the `Minimum Path Sum in a Triangle` contract.
```

### contracts/sms.js
```
$ run contracts/sms.js HOST FILENAME

Solves and submits the answer for the `Subarray with Maximum Sum` contract.
```

### daemon.js
```
$ run daemon.js [HOST]

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
Library scripts are not themselves executable, but contain functions that are intended to be imported into other scripts.

### log.lib.js
Contains functions to simplify providing verbose logging without clogging up the terminal. Adds `-v` and `--verbose` flags to scripts that import this library. Intended to be imported in its entirety.

```js
import * as log from "log.lib.js";

/** @param {NS} ns **/
export async function main(ns) {
    log.info("This will always print to terminal.")
    log.verbose("This will only print if -v or --verbose are provided.")
}
```

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
