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
const Frog = require("../../Frog");

const PlayerInfo = require("../../player/PlayerInfo");

const Logger = require("../../utils/Logger");

const { getKey } = require("../../utils/Language");

const Packet = require("./Packet");

class ClientTextPacket extends Packet {
	name = "text";

	/**
	 * @param {import("Frog").Player} player
	 * @param {import("Frog").Packet} packet
	 */
	async readPacket(player, packet) {
		const message = packet.data.params.message;

		if (Frog.config.chat.features.chat || !message.trim() || message.startsWith("/")) {
			return;
		}

		let shouldChat = true;

		Frog.eventEmitter.emit("playerChat", {
			player,
			message,
			cancel: () => {
				shouldChat = false;
			},
		});

		if (!shouldChat) return;

		const formattedMessage = getKey("chat.format").replace("%s", player.username).replace("%d", message.replace(/§/g, ""));

		Logger.info(formattedMessage);

		for (const recipient of PlayerInfo.playersOnline) {
			recipient.sendMessage(formattedMessage);
		}
	}
}

module.exports = ClientTextPacket;
