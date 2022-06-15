const ankiToJson = require("anki-to-json").default;
const fs = require("fs").promises;
const path = require("path");

function listenForClicks() {
	document.addEventListener("click", (e) => {

		if (e.target.taskList.contains("refresh")) {
			refreshDatabase();
		} 
		else if (e.target.taskList.contains("activate")) {
			activateTranslation();
		}
		
	})
}

function fillDatabase() {
	//ankiToJSON and push to storage
	const ankiDir = path.join(__dirname, "..", "anki");
	const apkgFiles = await findFilesWithExt(ankiDir, ".apkg");

	const jsonDir = path.join(ankiDir, "json");
	await fs.mkdir(jsonDir);

	for (file of apkgFiles) {
		ankiToJson(file, jsonDir);
		//Then need to parse those json files into storage.local
		const jsonFiles = await findFilesWithExt(jsonDir, ".json")

		//parse json files and save key value pairs to local storage

	}
}

/* Clear storage, process anki files with ankiToJson and push to storage */
function refreshDatabase() {
	let clearStorage = browser.storage.local.clear();
	clearStorage.then(fillDatabase(), console.error("Failed to refresh data: ${error}"));
}


/* Check if there is an existing database, create a database if not, then run translate.js */
function activateTranslation() {

}

async function findFilesWithExt(folderName, extName) {
	let extFiles = [];

	async function findFiles(folderName, extName) {
		const items = await fs.readdir(folderName, { withFileTypes: true });

		for (item of items) {
			if (item.isDirectory()) {
				await findFiles(path.join(folderName, item.name))
			} else {
				if (path.extname(item.name) === extName) {
					salesFiles.push(path.join(folderName, item.name));
				}
			}
		}
	}

	await findFiles(folderName);

	return extFiles;
}

//Consider making this async with readFile after learning more
function jsonToLocalStorage(jsonFiles) {
	for (file of jsonFiles) {
		let jsonFile = fs.readFileSync(file, 'utf8');
		let deck = JSON.parse(jsonFile);
		//Save key value pairs to local storage
		//Need to know the json formatting to complete this
	}
}
