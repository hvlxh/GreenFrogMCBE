/**
 * ░██████╗░██████╗░███████╗███████╗███╗░░██╗███████╗██████╗░░█████╗░░██████╗░
 * ██╔════╝░██╔══██╗██╔════╝██╔════╝████╗░██║██╔════╝██╔══██╗██╔══██╗██╔════╝░
 * ██║░░██╗░██████╔╝█████╗░░█████╗░░██╔██╗██║█████╗░░██████╔╝██║░░██║██║░░██╗░
 * ██║░░╚██╗██╔══██╗██╔══╝░░██╔══╝░░██║╚████║██╔══╝░░██╔══██╗██║░░██║██║░░╚██╗
 * ╚██████╔╝██║░░██║███████╗███████╗██║░╚███║██║░░░░░██║░░██║╚█████╔╝╚██████╔╝
 * ░╚═════╝░╚═╝░░╚═╝╚══════╝╚══════╝╚═╝░░╚══╝╚═╝░░░░░╚═╝░░╚═╝░╚════╝░░╚═════╝░
 *
 * The content of this file is licensed using the CC-BY-4.0 license
 * which requires you to agree to its terms if you wish to use or make any changes to it.
 *
 * @license CC-BY-4.0
 * @link Github - https://github.com/GreenFrogMCBE/GreenFrogMCBE
 * @link Discord - https://discord.gg/UFqrnAbqjP
 */
const Frog = require("../Frog");
const Logger = require("../utils/Logger");

const PlayerInfo = require("../player/PlayerInfo");

const Language = require("./Language");

module.exports = {
	/**
	 * Removes data of offline players
	 */
	async clearOfflinePlayers() {
		Frog.eventEmitter.emit("serverOfflinePlayersGarbageCollection");

		const onlinePlayers = PlayerInfo.playersOnline;
		const playersToRemove = [];

		for (let i = 0; i < onlinePlayers.length; i++) {
			if (onlinePlayers[i].offline) {
				playersToRemove.push(onlinePlayers[i]);
			}
		}

		playersToRemove.forEach(player => {
			Logger.debug(Language.getKey("garbageCollector.deleted").replace("%s", player.username));

			const index = onlinePlayers.indexOf(player);

			if (index !== -1) {
				onlinePlayers.splice(index, 1);
			}
		});
	},

	/**
	 * Clears RAM from useless entries
	 */
	async gc() {
		Logger.debug(Language.getKey("garbageCollector.started"));

		await this.clearOfflinePlayers();

		Frog.eventEmitter.emit("serverGarbageCollection");

		for (const player of PlayerInfo.playersOnline) {
			delete player.q;
			delete player.q2;
			delete player.skinData;
			delete player.userData;
		}

		Logger.debug(Language.getKey("garbageCollector.finished"));
	},
};
