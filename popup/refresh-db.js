const ankiToJson = require("anki-to-json").default;
const fs = require("fs").promises;
const path = require("path");

const translationObject = "translation";
window[translationObject] = {};

function listenForClicks() {
	document.addEventListener("click", (e) => {
		if (e.target.taskList.contains("activate")) {
			activateTranslation();
		}		
	})
}

/* Clear storage, process anki files with ankiToJson and push to storage */
function activateTranslation() {
	let clearStorage = browser.storage.local.clear();
	clearStorage.then(window[translationObject] = {}, console.error("Failed to refresh data: ${error}"));
	clearStorage.then(fillStorage(), console.error("Failed to reset translation object when clearing storage: ${error}"));
}

/*Process anki files with ankiToJson and save to storage with jsonToLocalStorage*/
function fillStorage() {
	//find all anki files in the anki directory
	const ankiDir = path.join(__dirname, "..", "anki");
	const apkgFiles = findFilesWithExt(ankiDir, ".apkg");

	//create a directory to store the json files if it doesn't exist
	const jsonDir = path.join(ankiDir, "json");
	if (!fs.existsSync(jsonDir)) {
		fs.mkdirSync(jsonDir);
	}

	//convert anki files to json and save json files in jsonDir
	for (const file of apkgFiles) {
		ankiToJson(file, jsonDir);	
	}

	//find all json files in the json directory and save their foreign-native word pairs to local storage
	const jsonFiles = findFilesWithExt(jsonDir, ".json");
	jsonToLocalStorage(jsonFiles);
}

/*Recursively find all files of given extension name within a directory*/
function findFilesWithExt(dirName, extName) {
	let extFiles = [];

	/*Helper function to search recursively*/
	function findFiles(dirName, extName) {
		const items = fs.readdirSync(dirName, { withFileTypes: true });

		for (const item of items) {
			if (item.isDirectory()) {
				findFiles(path.join(dirName, item.name))
			} else {
				if (path.extname(item.name) === extName) {
					extFiles.push(path.join(dirName, item.name));
				}
			}
		}
	}

	findFiles(dirName, extName);

	return extFiles;
}

/*Extracts foreign-native word pairs from json files and saves them to local storage*/
//Consider making this async with readFile after learning more
function jsonToLocalStorage(jsonFiles) {

	for (const file of jsonFiles) {
		const jsonFile = fs.readFileSync(file, 'utf8');
		const deck = JSON.parse(jsonFile);
		//Save foreign-native word pairs to local storage
		for (const card of deck) {
			//If there are multiple words per card, save each word separately
			//Each key can only map to one value, meaning each foreign word will map to only one native word.
			//Some native words may not be represented, but every foreign word will be represented, achieving desired goal of practicing vocab.
			const keys = card.back.split('\n')[0].split(', '); //foreign
			const vals = card.back.split('\n')[1].split(', '); //native

			/*Consider adding functionality to show alternative translations when word is clicked/hovered on*/
			for (let i = 0; i < (Math.min(keys.length, vals.length)); i++) {
				//Make a single 'translation' object, and add all the key[i] vals[i] pairs as properties before saving it to local storage
				window[translationObject][keys[i]] = vals[i];
			}
		}
	}
	//Save translations
	browser.storage.local.set(window[translationObject]).catch(alert("unable to save translations, try again"));
}
