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
const { players: playerList } = require("../../player/PlayerInfo");
const { lang, config } = require("../ServerInfo");
const Logger = require("../Logger");

class CommandList extends require("./Command") {
	name() {
		return lang.commands.listc;
	}

	aliases() {
		return null;
	}

	execute(isconsole = true, client) {
		const playerNames = playerList.map(player => player.username);
		const playerCount = playerList.length;
		const playerListMessage = lang.commands.playerList.replace("%info%", `${playerCount}/${config.maxPlayers}`);

		if (!isconsole) {
			client.sendMessage(playerListMessage);
			if (playerCount > 0) {
				client.sendMessage(playerNames.join(", "));
			}
			return;
		}

		Logger.log(playerListMessage);
		if (playerCount > 0) {
			Logger.log(playerNames.join(", "));
		}
	}

	getPlayerDescription() {
		return lang.commands.ingameListDescription;
	}

	executePlayer(client) {
		if (!config.playerCommandList) {
			client.sendMessage(lang.errors.playerUnknownCommand);
			return;
		}

		this.execute(false, client);
	}
}

module.exports = CommandList;
