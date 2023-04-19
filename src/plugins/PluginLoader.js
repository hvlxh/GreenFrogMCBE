/**
 * ░██████╗░██████╗░███████╗███████╗███╗░░██╗███████╗██████╗░░█████╗░░██████╗░
 * ██╔════╝░██╔══██╗██╔════╝██╔════╝████╗░██║██╔════╝██╔══██╗██╔══██╗██╔════╝░
 * ██║░░██╗░██████╔╝█████╗░░█████╗░░██╔██╗██║█████╗░░██████╔╝██║░░██║██║░░██╗░
 * ██║░░╚██╗██╔══██╗██╔══╝░░██╔══╝░░██║╚████║██╔══╝░░██╔══██╗██║░░██║██║░░╚██╗
 * ╚██████╔╝██║░░██║███████╗███████╗██║░╚███║██║░░░░░██║░░██║╚█████╔╝╚██████╔╝
 * ░╚═════╝░╚═╝░░╚═╝╚══════╝╚══════╝╚═╝░░╚══╝╚═╝░░░░░╚═╝░░╚═╝░╚════╝░░╚═════╝░
 *
 *
 * Copyright 2023 andriycraft
 * Github: https://github.com/andriycraft/GreenFrogMCBE
 */
const fs = require("fs");

const Logger = require("../server/Logger");
const PluginManager = require("./PluginManager");

const CCH = require("../server/ConsoleCommandSender");
const { getKey } = require("../utils/Language");

/** @private */
let pluginCount = 0;
/** @private */
let config;

module.exports = {
	/**
	 * Returns plugin count
	 * 
	 * @returns {number}
	 */
	pluginCount,

	/**
	 * Loads all plugins
	 * 
	 * @function
	 */
	loadPlugins() {
		fs.mkdirSync('./plugins/', { recursive: true });
		fs.mkdirSync('./pluginData/', { recursive: true });

		setTimeout(() => {
			CCH.start();
		}, 1500);

		fs.readdir("./plugins", (_err, files) => {
			files.forEach((file) => {
				fs.stat(`${__dirname}/../../plugins/${file}`, (error, stats) => {
					if (error) {
						Logger.error(getKey("plugin.loading.failed").replace("%s%", file).replace("%d%", error.stack));
						return;
					}

					if (stats.isDirectory()) {
						let name, version, main;

						try {
							const packageJson = require(`${__dirname}/../../plugins/${file}/package.json`);

							name = packageJson.displayName;
							version = packageJson.version;
							main = packageJson.main;

							PluginManager.addPlugin(name, version)
							Logger.info(getKey("plugin.loading.loading").replace('%s%', name).replace('%d%', version))
						} catch (error) {
							Logger.warning(getKey("plugin.loading.warning.invalidJson").replace("%s%", file).replace("%d%", error.stack));
							return;
						}

						try {
							require(`${__dirname}/../../plugins/${file}/${main}`).onLoad();

							PluginManager.addPlugin(name, version);
							Logger.info(getKey("plugin.loading.loaded").replace('%s%', name).replace('%d%', version))
						} catch (error) {
							Logger.error(getKey("plugin.loading.failed").replace("%s%", name).replace("%d%", error.stack));
						}
					}
				});
			});
		});
	},

	/**
	 * Kills the server
	 * 
	 * @function
	 */
	async killServer() {
		config = require("../Frog").serverConfigurationFiles.config;

		process.exit(config.exitCode);
	},

	/**
	 * Prepares plugins for shutdown
	 * 
	 * @function
	 */
	initPluginShutdown() {
		pluginCount--;

		if (pluginCount <= 0) this.killServer();
	},

	/**
	 * Unloads plugins
	 * 
	 * @function
	 * @async
	 */
	async unloadPlugins() {
		fs.readdir("./plugins", (_err, files) => {
			if (files.length === 0) this.killServer();

			files.forEach((file) => {
				fs.stat(`${__dirname}/../../plugins/${file}`, (error, stats) => {
					if (error) {
						Logger.error(getKey("plugin.unloading.failed").replace('%s%', file).replace('%d%', error.stack))
						return;
					}

					if (stats.isDirectory()) {
						pluginCount++;
						let name, main;

						try {
							const packageJson = require(`${__dirname}/../../plugins/${file}/package.json`);
							name = packageJson.displayName;
							main = packageJson.main;

							Logger.info(getKey("plugin.unloading.unloading").replace("%s%", name));
						} catch (error) {
							return;
						}

						try {
							require(`${__dirname}/../../plugins/${file}/${main}`).onShutdown();

							Logger.info(getKey("plugin.unloading.success").replace("%s%", name));
						} catch (error) {
							Logger.error(getKey("plugin.unloading.failed").replace('%s%', name).replace('%d%', error.stack))
						}

						this.initPluginShutdown();
					}
				});
			});
		});
	},
};
