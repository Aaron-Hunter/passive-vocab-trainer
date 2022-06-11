function fillDatabase() {
	//ankiToJSON and push to storage
}

/* Clear storage, process anki files with ankiToJson and push to storage */
function refreshDatabase() {
	let clearStorage = browser.storage.local.clear();
	clearStorage.then(fillDatabase(), console.error("Failed to refresh data: ${error}"));
}


/* Check if there is an existing database, create a database if not, then run translate.js */
function activateTranslation() {

}

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

