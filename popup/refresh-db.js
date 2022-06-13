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
	const apkgFiles = await findApkgFiles(ankiDir);
}

/* Clear storage, process anki files with ankiToJson and push to storage */
function refreshDatabase() {
	let clearStorage = browser.storage.local.clear();
	clearStorage.then(fillDatabase(), console.error("Failed to refresh data: ${error}"));
}


/* Check if there is an existing database, create a database if not, then run translate.js */
function activateTranslation() {

}

async function findApkgFiles(folderName) {
	let apkgFiles = [];

	async function findFiles(folderName) {
		const items = await fs.readdir(folderName, { withFileTypes: true });

		for (item of items) {
			if (item.isDirectory()) {
				await findFiles(path.join(folderName, item.name))
			} else {
				if (path.extname(item.name) === ".apkg") {
					salesFiles.push(path.join(folderName, item.name));
				}
			}
		}
	}

	await findFiles(folderName);

	return apkgFiles;
}

