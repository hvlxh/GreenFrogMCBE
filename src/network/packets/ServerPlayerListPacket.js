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
const PlayerListAction = require("./types/PlayerListAction");

const Packet = require("./Packet");

class ServerPlayerListPacket extends Packet {
	name = "player_list";

	/** @type {string | undefined} */
	username;
	/** @type {string | undefined} */
	uuid;
	/** @type {number | undefined} */
	id;
	/** @type {import("Frog").PlayListAction | undefined} */
	type;
	/** @type {string | undefined} */
	xbox_id;

	/**
	 * @param {import("Frog").Player} player
	 */
	writePacket(player) {
		let data = null;

		if (this.type === PlayerListAction.REMOVE) {
			data = {
				records: {
					type: PlayerListAction.REMOVE,
					records_count: 1,
					records: [
						{
							uuid: this.uuid,
						},
					],
				},
			};
		} else {
			data = {
				records: {
					type: PlayerListAction.ADD,
					records_count: 1,
					records: [
						{
							uuid: this.uuid,
							entity_unique_id: this.id,
							username: this.username,
							xbox_user_id: this.xbox_id,
							platform_chat_id: "",
							build_platform: 7,
							skin_data: require("../../resources/skinData.json"),
							is_teacher: false,
							is_host: false,
						},
					],
					verified: [true],
				},
			};
		}

		player.queue(this.name, data);
	}
}

module.exports = ServerPlayerListPacket;
