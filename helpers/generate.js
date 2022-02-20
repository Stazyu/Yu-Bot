function randomInteger(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 
 * @param {Number} length 
 * @param {{extension: String}} options 
 * @returns 
 */
function randomString(length, options = {}) {
	let result = '';
	let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() *
			charactersLength));
	}
	return options.extension !== undefined ? result + options.extension : result;
}

module.exports = { randomInteger, randomString }