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
    async execute(msg, conn) {
        const { isImage, isQuotedImage, user_id } = msg;
        console.log(await conn.fetchStatus(user_id));
        // db.insertOneDocument('users', { title: 'test2', name: 'Aman Bos sip' })
        // db.updateOneDocument('users', {})
    }
}