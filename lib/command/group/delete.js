const { reply } = require("../../functions");

module.exports = {
    name: "Delete message",
    command: ['delete', 'del'],
    category: 'group',
    isGroupAdmin: true,
    desc: '',
    async execute(msg, conn) {
        const { chat, from, quotedInfo } = msg;
        try {
            await conn.sendMessage(from, {
                delete: {
                    remoteJid: from,
                    fromMe: true,
                    id: quotedInfo.stanzaId,
                    participant: quotedInfo.participant
                }
            });
        } catch (err) {
            reply(from, 'Tidak bisa menghapus chat orang lain!', chat)
            console.log(err);
        }
    }
}