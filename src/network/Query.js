const Logger = require("../server/Logger");

const { SmartBuffer } = require("@harmonytf/smart-buffer");
const dgram = require("dgram");

class Query {
	clientTokens = new Map();

	constructor() {
		this.socket = dgram.createSocket("udp4");
		this.info = {}
	}

	start(info) {
		this.info = info;
		this.socket.bind(this.info.port);

		this.socket.on("listening", () => {
			const address = this.socket.address();

			Logger.info(`Query server listening on /${address.address}:${address.port}`);
		});

		this.socket.on("message", (msg, rinfo) => {
			this._handle(msg, rinfo);
		});
	}

	/**
  	 * Generates a token
	 * 
	 * @returns {number}
	 */
	_generateToken() {
		const min = Math.ceil(1000000);
		return Math.floor(Math.random() * (Math.floor(9999999) - min + 1) + min);
	}

	/**
 	 * Handles query packets
     * 
	 * @param {Buffer} msg
	 * @param {dgram.RemoteInfo} rinfo
	 */
	_handle(msg, rinfo) {
		const magick = msg.readUInt16BE(0);
		const type = msg.readUInt8(2);

		if (magick !== 0xfefd) {
			Logger.warning(`${rinfo.address} sent bad query data.`);
			return;
		}

		if ((this.clientTokens.has(rinfo.address) && this.clientTokens.get(rinfo.address).expiresAt < Date.now()) || !this.clientTokens.has(rinfo.address)) {
			Logger.info(`Generating a query token for ${rinfo.address}`);
			this.clientTokens.set(rinfo.address, {
				token: this._generateToken(),
				expiresAt: Date.now() + 30 * 1000,
			});
		}

		if (type === 0x09) {
			Logger.info(`Responded with a query handshake packet to ${rinfo.address}`);
			this._sendHandshake(rinfo, msg);
		} else if (type === 0x00 && msg.length == 15) {
			Logger.info(`Responded with a query full info packet to ${rinfo.address}`);
			this._sendFullInfo(rinfo, msg);
		} else if (type === 0x00 && msg.length == 11) {
			Logger.info(`Responded with a query basic info packet to ${rinfo.address}`);
			this._sendBasicInfo(rinfo, msg);
		}
	}

	/**
	 * Sends the handshake packet
  	 *
	 * @param {Buffer} rinfo
	 * @param {dgram.RemoteInfo} msg
	 */
	_sendHandshake(rinfo, msg) {
		const sessionID = msg.readInt32BE(3);
		const clientToken = this.clientTokens.get(rinfo.address).token;
		if (!this.clientTokens.has(rinfo.address) || this.clientTokens.get(rinfo.address).expiresAt < Date.now()) {
			return;
		}

		const buffer = new SmartBuffer();
		buffer.
			writeUInt8(0x09).
			writeInt32BE(sessionID).
			writeStringNT(clientToken.toString());

		const data = buffer.toBuffer();

		this.socket.send(data, 0, data.length, rinfo.port, rinfo.address, (err) => {
			if (err) {
				Logger.error(`Query error: ${err.stack}`);
			}
		});
	}

	/**
	 * Sends the basic info packet
	 *
  	 * @param {dgram.RemoteInfo} rinfo
	 * @param {Buffer} message
	 */
	_sendBasicInfo(rinfo, message) {
		const sessionID = message.readInt32BE(3);
		const clientToken = this.clientTokens.get(rinfo.address).token;

		if (!this.clientTokens.has(rinfo.address) || this.clientTokens.get(rinfo.address).expiresAt < Date.now() || clientToken !== this.clientTokens.get(rinfo.address).token) {
			return;
		}

		const buffer = new SmartBuffer();
		
		buffer
			.writeUInt8(0x00)
			.writeInt32BE(sessionID)
			.writeStringNT(this.info.motd)
			.writeStringNT("MINECRAFTBE")
			.writeStringNT(this.info.levelName)
			.writeStringNT(String(this.info.players.length))
			.writeStringNT(String(this.info.maxPlayers))
			.writeUInt16LE(this.info.port).
			writeStringNT(this.info.host);

		const data = buffer.toBuffer();

		this.socket.send(data, 0, data.length, rinfo.port, rinfo.address, (err) => {
			if (err) {
				Logger.error(`Query error: ${err.stack}`);
			}
		});
	}

	/** 
  	 * Sends the full info packet
	 * 
  	 * @param {dgram.RemoteInfo} rinfo
	 * @param {Buffer} message
	 */
	_sendFullInfo(rinfo, message) {
		const sessionID = message.readInt32BE(3);
		const clientToken = this.clientTokens.get(rinfo.address).token;

		if (!this.clientTokens.has(rinfo.address) || this.clientTokens.get(rinfo.address).expiresAt < Date.now() || clientToken !== this.clientTokens.get(rinfo.address).token) {
			return;
		}

		const kvData = [
			{ key: "hostname", value: this.info.motd },
			{ key: "gametype", value: this.info.gamemode },
			{ key: "game_id", value: "MINECRAFTBE" },
			{ key: "version", value: this.info.version },
			{ key: "server_engine", value: "GreenFrogMCBE" },
			{ key: "plugins", value: `GreenFrogMCBE: ${this.info.plugins.join("; ")}` },
			{ key: "map", value: this.info.levelName },
			{ key: "numplayers", value: this.info.players.length },
			{ key: "maxplayers", value: this.info.maxPlayers },
			{ key: "whitelist", value: this.info.wl },
			{ key: "hostip", value: this.info.host },
			{ key: "hostport", value: this.info.port },
		];

		const buffer = new SmartBuffer();
		
		buffer.
			writeUInt8(0x00).
			writeInt32BE(sessionID).
			writeStringNT("splitnum").
			writeUInt8(0x80).writeUInt8(0x00);

		kvData.forEach(({ key, value }) => {
			buffer.writeStringNT(String(key));
			buffer.writeStringNT(String(value));
		});

		buffer.
			writeUInt8(0x00).
			writeUInt8(0x01).
			writeStringNT("player_").
			writeUInt8(0x00);

		this.info.players.forEach((playerName) => {
			buffer.writeStringNT(playerName);
		});

		buffer.writeUInt8(0x00);

		const data = buffer.toBuffer();
		this.socket.send(data, 0, data.length, rinfo.port, rinfo.address, (err) => {
			if (err) {
				Logger.error(`Query error: ${err.stack}`);
			}
		});
	}
}

module.exports = Query;
