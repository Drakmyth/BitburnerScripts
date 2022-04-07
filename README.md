# Bitburner Scripts
[![License](https://img.shields.io/github/license/Drakmyth/BitburnerScripts)](https://github.com/Drakmyth/BitburnerScripts/blob/master/LICENSE.md)

This repository contains scripts I have written while playing the idle hacking game [Bitburner](https://store.steampowered.com/app/1812820/Bitburner/). Scripts are divided into two types: `Functional Scripts` and `Library Scripts`.

## Functional Scripts
Functional scripts are scripts that are either facilitate automation or are intended to be executed directly to display information.

### daemon.js
Simple weaken-grow-hack script. Takes the hostname as a parameter. Has hardcoded money and security thresholds at 0.75 and 5 respectively.

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

## License

These scripts are licensed under the MIT License (MIT). See LICENSE for details.
