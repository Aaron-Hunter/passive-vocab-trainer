const translationObj = browser.storage.local.get("translation");

//Get all the p nodes
const nativeParas = document.getElementsByTagName("p");

//Iterate through the collection of p nodes, extracting the text and passing to the translation function
for (let i = 0; i < nativeParas.length; i++) {
	let nativeStr = nativeParas[i].textContent;
	let foreignStr = translateKnownWords(nativeStr);
	nativeParas[i].nodeValue = foreignStr;
}

/*Parse a given string and translate the known words
Input:  nativeStr  a string with all words in the native language
Output:  mixedStr  a string with known words translated*/
function translateKnownWords(nativeStr) {
	//Split by space, comma, or period while preserving these seperators
	const mixedWords = nativeStr.split(/([ ,.]+)/g);
	for (let i = 0; i < mixedWords.length; i++) {
		//Only check for translation of words, skip empty strings and seperators
		if (mixedWords[i].length > 0 && mixedWords[i].match(/[ ,.]+/)) {
			//check if the word is in the database of known words and if it is, replace the word with its translation
			translationObj.then(() => {
				if (typeof translationObj[mixedWords[i]] !== "undefined") {
					mixedWords[i] = translationObj[mixedWords[i]]
				}
			}, () => {/*ignore*/});
		}
	}
	//Do not need a seperator when joining because spaces were preserved
	return mixedWords.join();
}