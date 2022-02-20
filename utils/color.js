const chalk = require('chalk')

/**
 * 
 * @param {String} text Teks yang akan dirubah warnanya
 * @param {String } color Warna teksnya
 * @returns 
 */
const color = (text, color = null) => {
    return !color ? chalk.green(text) : chalk.keyword(color)(text);
}

/**
 * 
 * @param {String} text Teks yang akan dirubah warnanya
 * @param {String} bgcolor  
 * @returns 
 */
const bgColor = (text, bgcolor = null) => {
    return !bgcolor ? chalk.bgGreen(text) : chalk.bgKeyword(bgcolor)(text)
}

module.exports = { color, bgColor };