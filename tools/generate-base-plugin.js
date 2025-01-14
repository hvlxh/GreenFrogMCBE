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
const fs = require("fs");
const path = require("path");
const readline = require("readline");

const { convertConsoleColor } = require("../src/utils/ConsoleColorConvertor");

const Colors = require("../src/utils/types/Colors");

/** @type {string} */
let pluginName;

const pluginsFolderPath = path.join(__dirname, "..", "plugins");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

/**
 * Handles errors and displays them in red color.
 *
 * @param {string} message - The error message.
 */
function handleError(message) {
	console.clear();
	console.error(convertConsoleColor(`${Colors.RED}${message}${Colors.RESET}`));
	process.exit(1);
}

/**
 * Creates a directory if it doesn't exist.
 *
 * @param {string} directoryPath - The path of the directory to create.
 */
function createDirectoryIfNotExists(directoryPath) {
	if (!fs.existsSync(directoryPath)) {
		fs.mkdirSync(directoryPath);
	}
}

/**
 * Writes the package.json file for the plugin.
 *
 * @param {string} directoryPath - The directory path.
 * @param {string} pluginName - The name of the plugin.
 */
function writePackageJson(directoryPath, pluginName) {
	const packageJson = {
		name: pluginName.toLowerCase(),
		main: `${pluginName.toLowerCase()}.js`,
		version: "1.0.0",
		displayName: pluginName,
	};

	fs.writeFileSync(`${directoryPath}/package.json`, JSON.stringify(packageJson, null, 4));
}

/**
 * Writes the plugin main file.
 *
 * @param {string} directoryPath - The directory path.
 * @param {string} pluginName - The name of the plugin.
 * @param {boolean} useTypeScript - Whether to use TypeScript.
 */
function writePluginFile(directoryPath, pluginName, useTypeScript) {
	let pluginJs = `module.exports = {
	/**
     * This executes when the plugin loads
	 */
	onLoad() {
		// ...
	},

	/**
     * This executes when the plugin shutdowns
     */
	onShutdown() {
		// ...
	},
};`;

	if (useTypeScript) {
		try {
			require("typescript");
		} catch {
			handleError(
				"TypeScript is not installed. Please install it to create TypeScript plugins (Hint: To install it, run \"npm i typescript\")"
			);
		}

		pluginJs = `/**
 * This executes when the plugin loads
 */
export function onLoad(): void {
    // ...
}

/**
 * This executes when the plugin shutdowns
 */
export function onShutdown(): void {
    // ...
}`;
		const tsConfig = {
			compilerOptions: {
				strict: true,
				esModuleInterop: true,
				resolveJsonModule: true,
				allowJs: true,
			},
			include: ["../../**/*", "../../index.d.ts"],
		};

		fs.writeFileSync(
			`${directoryPath}/tsconfig.json`,
			JSON.stringify(tsConfig, null, 4)
		);
	}

	fs.writeFileSync(`${directoryPath}/${pluginName.toLowerCase()}.${useTypeScript ? "ts" : "js"}`, pluginJs);
}

/**
 * Handles user input for whether to use TypeScript.
 *
 * @param {string} ts - User input for TypeScript (Y/N).
 */
async function handleUserInputForTypeScript(ts) {
	const useTypeScript = ts.toLowerCase() === "y";

	if (!["y", "n"].includes(ts.toLowerCase())) {
		handleError("Please enter \"Y\" for yes or \"N\" for no");
	}

	const pluginDirPath = path.join(pluginsFolderPath, pluginName);

	createDirectoryIfNotExists(pluginsFolderPath);

	try {
		createDirectoryIfNotExists(pluginDirPath);
	} catch (error) {
		if (error.message.includes("file already exists")) {
			handleError("Plugin directory already exists");
		} else {
			handleError(`There was an error when creating a plugin! ${error}`);
		}
	}

	writePackageJson(pluginDirPath, pluginName);
	writePluginFile(pluginDirPath, pluginName, useTypeScript);

	console.clear();
	console.info(convertConsoleColor(`${Colors.GREEN}Plugin created!${useTypeScript ? ` (Hint: To compile it, run "npx tsc ${pluginName.toLowerCase()}.ts")` : ""}${Colors.RESET}`));
	process.exit(0);
}

/**
 * Handles user input for the plugin name.
 *
 * @param {string} pluginNameInput - User input for the plugin name.
 */
async function handleUserInputForPluginName(pluginNameInput) {
	if (!pluginNameInput) {
		handleError("Please enter a plugin name");
	}

	pluginName = pluginNameInput;

	rl.question(
		convertConsoleColor(
			`${Colors.GREEN}Do you want to use TypeScript [Y/N]? (Hint: "Y" stands for yes and "N" stands for no) ${Colors.RESET}`
		),
		(input) => {
			handleUserInputForTypeScript(input);
		}
	);
}

/**
 * Starts the plugin creation process.
 */
async function start() {
	rl.question(
		convertConsoleColor(
			`${Colors.GREEN}Please enter the name of your plugin... ${Colors.RESET}`
		),
		(input) => {
			handleUserInputForPluginName(input);
		}
	);
}

start();
