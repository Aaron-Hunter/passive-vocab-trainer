const ankiToJson = require("anki-to-json").default;
const fs = require("fs").promises;
const path = require("path");

function listenForClicks() {
	document.addEventListener("click", (e) => {
		if (e.target.taskList.contains("activate")) {
			activateTranslation();
		}		
	})
}

function fillDatabase() {
	//ankiToJSON and push to storage
	const ankiDir = path.join(__dirname, "..", "anki");
	const apkgFiles = findFilesWithExt(ankiDir, ".apkg");

	const jsonDir = path.join(ankiDir, "json");
	fs.mkdirSync(jsonDir);

	for (const file of apkgFiles) {
		ankiToJson(file, jsonDir);
		//Then need to parse those json files into storage.local
		const jsonFiles = findFilesWithExt(jsonDir, ".json")

		//parse json files and save key value pairs to local storage
		jsonToLocalStorage(jsonFiles);
	}
}

/* Clear storage, process anki files with ankiToJson and push to storage */
function activateTranslation() {
	let clearStorage = browser.storage.local.clear();
	clearStorage.then(fillDatabase(), console.error("Failed to refresh data: ${error}"));
}

function findFilesWithExt(folderName, extName) {
	let extFiles = [];

	function findFiles(folderName, extName) {
		const items = fs.readdirSync(folderName, { withFileTypes: true });

		for (const item of items) {
			if (item.isDirectory()) {
				findFiles(path.join(folderName, item.name))
			} else {
				if (path.extname(item.name) === extName) {
					extFiles.push(path.join(folderName, item.name));
				}
			}
		}
	}

	findFiles(folderName, extName);

	return extFiles;
}

//Consider making this async with readFile after learning more
function jsonToLocalStorage(jsonFiles) {
	for (const file of jsonFiles) {
		const jsonFile = fs.readFileSync(file, 'utf8');
		const deck = JSON.parse(jsonFile);
		//Save key value pairs to local storage
		//Need to know the json formatting to complete this
		for (const card of deck) {
			const keys = card.back.split('\n')[0].split(', ');
			const vals = card.back.split('\n')[1].split(', ');

			//If there are multiple words per card, save each word separately
			/*Each key can only map to one value, meaning each Foreign word will map to only one Native word, and some Native words may not be represented.
			** Consider adding functionality to show alternative translations when word is clicked/hovered on*/
			for (let i = 0; i < (Math.min(keys.length, vals.length)); i++) {
				localStorage.setItem(keys[i], vals[i]); 
			}
		}
	}
}
