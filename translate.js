// Get all the p nodes in an HTMLCollection
const engParas = document.getElementsByTagName("p");

// Iterate through the collection, extracting the text and passing to the translation function
for (let i = 0; i < engParas.length; i++) {
	let engStr = engParas[i].textContent;
	let transStr = translateKnownWords(engStr);
	engParas[i].nodeValue = transStr;
}

function translateKnownWords(initStr) {
	let words = initStr.split();
	words.forEach(word => {
		//check if the word is in the database of known words and if it is, replace the word with its translation
	})
}