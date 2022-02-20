const { sendText, reply } = require("../../functions");

module.exports = {
    name: "Naikan jabatan member",
    command: ['promote', 'demote'],
    category: "group",
    isGroup: true,
    isAdminGroup: true,
    description: `Desc: Naikan jabatan member group
    
    Format: prefix.kick @tag member yang akan di kick`,
    async execute(msg, conn) {
        const { command, from, mentionedJid, chat, groupAdmins, botNumber } = msg;
        const isBotAdmin = groupAdmins.some(v => v === botNumber);
        if (command === 'promote') {
            if (!isBotAdmin) return reply(from, `Gagal menaikan jabatan @${mentionedJid[0].split('@')[0]}, pastikan bot sudah menjadi admin!`, chat, { mentions: mentionedJid });
            if (mentionedJid !== []) {
                const response = await conn.groupParticipantsUpdate(
                    from,
                    mentionedJid,
                    "promote" // replace this parameter with "add", "remove", "demote" or "promote"
                );
                await sendText(from, `Berhasil menaikan jabatan @${mentionedJid[0].split('@')[0]}`, { mentions: mentionedJid });
            } else {
                await reply(from, 'tag member yang akan di kick!');
            }
        } else if (command === 'demote') {
            if (!isBotAdmin) return reply(from, `Gagal menaikan jabatan @${mentionedJid[0].split('@')[0]}, pastikan bot sudah menjadi admin!`, chat, { mentions: mentionedJid });
            if (mentionedJid !== []) {
                const response = await conn.groupParticipantsUpdate(
                    from,
                    mentionedJid,
                    "demote" // replace this parameter with "add", "remove", "demote" or "promote"
                )
                await sendText(from, `Berhasil menurunkan jabatan @${mentionedJid[0].split('@')[0]}`, { mentions: mentionedJid });
            } else {
                await reply(from, 'tag member yang akan di kick!')
            }
        }
    }
}