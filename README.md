# Bitburner Scripts
[![License](https://img.shields.io/github/license/Drakmyth/BitburnerScripts)](https://github.com/Drakmyth/BitburnerScripts/blob/master/LICENSE.md)

This repository contains scripts I have written while playing the idle hacking game [Bitburner](https://store.steampowered.com/app/1812820/Bitburner/). Scripts are divided into two types: `Functional Scripts` and `Library Scripts`.

## Functional Scripts
Functional scripts are scripts that are either facilitate automation or are intended to be executed directly to display information.

### daemon.js
Simple weaken-grow-hack script. Takes the hostname as a parameter. Has hardcoded money and security thresholds at 0.75 and 5 respectively. There's typically no reason to run this script manually (though you can) because it is deployed and executed automatically by `flood.js`.

```
run daemon.js home
```

### flood.js
Automates the deployment of `daemon.js` across the network. Will recursively crawl the network cracking into any server it finds, then uploading and executing `daemon.js` on that server using enough threads to saturate the system. Currently supports opening up to 3 ports (SSH, FTP, SMTP). If a server requires more ports than that it will be skipped. If `daemon.js` is already running on a server, the existing process will be killed and `daemon.js` will be reuploaded and re-executed. This allows for deployment of updated versions of `daemon.js` across the network. Can optionally be supplied with `-v` or `--verbose` flags for much more detailed logging, though this significantly slows the execution of the script.

```
run flood.js
```

### map.js
Prints a recursive network tree to the terminal. Hardcoded to start at `home`.

```
run map.js
```

### servers.js
Purchases and/or upgrades servers to the largest amount of RAM the player can afford at the time the script is executed. Always purchases the maximum number of servers, and keeps all servers at the same amount of RAM. Automatically kills any running scripts on existing servers, but will not automatically run scripts on the newly purchased servers.

```
run servers.js
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
