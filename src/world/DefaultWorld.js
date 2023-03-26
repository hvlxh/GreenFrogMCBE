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
const WorldGenerator = require("../network/packets/types/WorldGenerator");
const { config, lang } = require("../api/ServerInfo");
const ServerTickEvent = require("../events/ServerTickEvent");
const PlayerInfo = require("../api/PlayerInfo");
const GameMode = require("../api/GameMode");
const Logger = require("../server/Logger");

class DefaultWorld {
	constructor() {
		this.name = "";
		this.cords = {
			x: null,
			y: null,
			z: null,
		};
		this.chunkRadius = 0;
		this._time = 0
	}

	/**
	 * Sets the world name
	 * @param {String} name
	 */
	setName(name) {
		this.name = name;
	}

	/**
	 * Returns the world name
	 * @returns The world name
	 */
	getName() {
		return this.name;
	}

	/**
	 * Returns the players that are in the world right now
	 * @returns Players in world
	 */
	getPlayersInWorld() {
		return PlayerInfo.players;
	}

	/**
	 * Sets the coordinates for the world spawn
	 * @param {Float} x
	 * @param {Float} y
	 * @param {Float} z
	 */
	setSpawnCoordinates(x, y, z) {
		this.cords = {
			x,
			y,
			z,
		};
	}

	/**
	 * Returns the spawn coordinates
	 */
	getSpawnCoordinates() {
		return this.cords;
	}

	/**
	 * Sets the chunk radius
	 * @param {Number} radius
	 */
	setChunkRadius(radius) {
		this.chunkRadius = radius;
	}

	/**
	 * Returns the chunk radius
	 */
	getChunkRadius() {
		return this.chunkRadius;
	}

	placeBlock() {

	}

	/**
	 * Ticks the world
	 * @private
	 */
	tick() {
		try {
			const serverTickEvent = new ServerTickEvent();
			serverTickEvent.world = this.toJSON();
			serverTickEvent.server = require("../Server");
			serverTickEvent.execute();

			if (config.tickWorldTime) {
				this._time = this._time + 10;
				for (const player of this.getPlayersInWorld()) {
					if (!player.offline) player.setTime(this._time);
				}
			}

			if (config.tickVoid) {
				for (const client of this.getPlayersInWorld()) {
					const posY = Math.floor(client.y);

					let min = -64;

					if (config.generator === WorldGenerator.VOID) {
						min = NaN;
					}

					if (posY <= min) {
						if (client.gamemode === GameMode.CREATIVE || client.gamemode === GameMode.SPECTATOR) {
							if (client.damage_loop) delete client.damage_loop;
						} else if (!client.cannotbedamagedbyvoid) {
							client.setHealth(client.health - 5);
						}
					} else {
						if (client.damage_loop) delete client.damage_loop;
					}
				}
			}
		} catch (e) {
			Logger.error(lang.errors.errorTickingWorld.replace("%e.stack%", e.stack));
		}
	}

	toJSON() {
		return {
			name: this.name,
			chunk_radius: this.chunkRadius,
			spawn_coordinates: this.cords,
		};
	}
}

module.exports = DefaultWorld;
