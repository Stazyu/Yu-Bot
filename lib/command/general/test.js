const { unlinkSync } = require("fs-extra");
const { upToTele } = require("../../../utils/convert");
const { downloadMediaWa } = require("../../functions");
const Database = require("../../../database/mongoDBModel");
const db = new Database('Whatsapp-Bot-MD');

module.exports = {
    name: "Testing",
    command: ['test', 'tes'],
    isOwner: true,
    description: '',
    async execute(msg, from) {
        const { isImage, isQuotedImage } = msg;
        // db.insertOneDocument('users', { title: 'test2', name: 'Aman Bos sip' })
        // db.updateOneDocument('users', {})
    }
}