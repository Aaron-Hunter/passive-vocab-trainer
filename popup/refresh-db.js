function fillDatabase() {
	//ankiToJSON and push to storage
}

/* Clear storage, process anki files with ankiToJson and push to storage */
function refreshDatabase() {
	let clearStorage = browser.storage.local.clear();
	clearStorage.then(fillDatabase(), console.error("Failed to refresh data: ${error}"));
}

function listenForClicks() {
	document.addEventListener("click", (e) => {
		function reportError(error) {
			console.error('Could not refresh database: ${error}');
		}

		
		refreshDatabase();
	})
}

