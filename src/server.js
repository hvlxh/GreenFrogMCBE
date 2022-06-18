/** @author KinashServerMCBE */
/** @author andriycraft */

const { RakNetServer, InternetAddress } = require("bbmc-raknet");
const Data = require('./data')
const config = require('../../config.json')
//const Logger = require('')


const raknet = new RakNetServer(new InternetAddress(config.host, config.port, Data.bind_version), Data.magicnumber);
console.log('ha')

function handle() {
	console.log('handle')
	setInterval(() => {
		if (raknet.isRunning === true) {
			raknet.message = `MCPE;Motd;${Data.protocol};${Data.version};0;5;${raknet.serverGUID.toString()};`;
		}
	});
	raknet.on('connect', (connection) => {
		console.log('connect')
	});
}

handle()