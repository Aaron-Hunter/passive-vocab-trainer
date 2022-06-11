const path = require("path");

module.exports = {
	entry: './popup/refresh-db.js',
	output: {
		path: path.resolve(__dirname, "addon"),
		filename: "[name]/src/index.js"
	}
}