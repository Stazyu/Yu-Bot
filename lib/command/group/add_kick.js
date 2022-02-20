const { sendText, reply } = require("../../functions");

module.exports = {
    name: "Kick member",
    command: ['add', 'kick'],
    category: "group",
    isAdminGroup: true,
    description: `Desc: Kick member di grup
    
Format: prefix.kick @tag member yang akan di kick`,
    async execute(msg, conn) {
        const { chat, command, from, mentionedJid, groupAdmins, botNumber, isGroup, prefix } = msg;
        if (!isGroup) return await reply(from, 'Maaf, fitur hanya bisa digunakan di Group!', chat)
        const isBotAdmin = groupAdmins.some(v => v === botNumber)
        if (!isBotAdmin) return await reply(from, `Gagal kick @${mentionedJid[0].split('@')[0]}, pastikan bot sudah menjadi admin group!`, chat, { mentions: mentionedJid });
        if (command === 'add') {
            if (mentionedJid[0] !== undefined) {
                const response = await conn.groupParticipantsUpdate(
                    from,
                    mentionedJid,
                    "add" // replace this parameter with "add", "remove", "demote" or "promote"
                )
                await sendText(from, `Perintah diterima, mengeluarkan : @${mentionedJid[0].split('@')[0]}`, { mentions: mentionedJid });
            } else {
                await reply(from, `Format salah, silahkan ketik ${prefix}add @tag member yang akan di kick/keluarkan!`);
            }
        } else if (command === 'kick') {
            if (mentionedJid[0] !== undefined) {
                const response = await conn.groupParticipantsUpdate(
                    from,
                    mentionedJid,
                    "remove" // replace this parameter with "add", "remove", "demote" or "promote"
                )
                await sendText(from, `Perintah diterima, mengeluarkan : @${mentionedJid[0].split('@')[0]}`, { mentions: mentionedJid });
            } else {
                await reply(from, `Format salah, silahkan ketik ${prefix}add @tag member yang akan di kick/keluarkan!`);
            }

        }
    }
}