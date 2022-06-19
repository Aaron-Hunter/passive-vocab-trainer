// Get all the p nodes in an HTMLCollection
const nativeParas = document.getElementsByTagName("p");

// Iterate through the collection, extracting the text and passing to the translation function
for (let i = 0; i < nativeParas.length; i++) {
	let nativeStr = nativeParas[i].textContent;
	let foreignStr = translateKnownWords(nativeStr);
	nativeParas[i].nodeValue = foreignStr;
}

function translateKnownWords(nativeStr) {
	let words = nativeStr.split();
	words.forEach(word => {
		//check if the word is in the database of known words and if it is, replace the word with its translation
	})
}