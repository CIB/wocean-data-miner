# wocean-data-miner

## Windows instructions

You will need a version of NodeJS on your system before you can use this application.

https://github.com/coreybutler/nvm-windows/releases

Download the latest version of nvm-setup.zip and run the installer. Then run the following commands in the terminal:

```bash
nvm install 20
nvm use 20
npm i -g bun
```

## General instructions

Open a terminal (Visual Studio Code recommended) and execute the following command:

```bash
bun install
bun run wiki -- ${wocean-install}/Data/rgss-db
```
