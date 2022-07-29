const { sendText, reply } = require("../../functions");
const { mess } = require("../../help");

module.exports = {
    name: "Naikan jabatan member",
    command: ['promote', 'demote'],
    category: "group",
    isGroupAdmin: true,
    description: `➾ prefix.promote [Untuk mnenaikkan jabatan orang di grup]
    - Format : prefix.promote <tag membernya>
    - Contoh : prefix.promote @628192736394
➾ prefix.demote [Untuk menurunkan jabatan orang di grup]
    - Format : prefix.demote <tag membernya>
    - Contoh : prefix.demote @62819282944`,
    async execute(msg, conn) {
        const { command, from, mentionedJid, chat, groupAdmins, botNumber, isGroup } = msg;
        if (!isGroup) return await reply(from, mess.info.onlyGroup, chat);
        const isBotAdmin = groupAdmins.some(v => v === botNumber);
        if (command === 'promote') {
            if (mentionedJid.length !== 0) {
                if (!isBotAdmin) return reply(from, `Gagal menaikan jabatan @${mentionedJid[0].split('@')[0]}, pastikan bot sudah menjadi admin!`, chat, { mentions: mentionedJid });
                const response = await conn.groupParticipantsUpdate(
                    from,
                    mentionedJid,
                    "promote" // replace this parameter with "add", "remove", "demote" or "promote"
                );
                await sendText(from, `Berhasil menaikan jabatan @${mentionedJid[0].split('@')[0]}`, { mentions: mentionedJid });
            } else {
                await reply(from, 'tag member yang akan di naikkan jabatannya!', chat);
            }
        } else if (command === 'demote') {
            if (mentionedJid.length !== 0) {
                if (!isBotAdmin) return reply(from, `Gagal menaikan jabatan @${mentionedJid[0].split('@')[0]}, pastikan bot sudah menjadi admin!`, chat, { mentions: mentionedJid });
                const response = await conn.groupParticipantsUpdate(
                    from,
                    mentionedJid,
                    "demote" // replace this parameter with "add", "remove", "demote" or "promote"
                )
                await sendText(from, `Berhasil menurunkan jabatan @${mentionedJid[0].split('@')[0]}`, { mentions: mentionedJid });
            }
            return await reply(from, 'tag member yang akan di turunkan jabatannya!', chat)
        }
    }
}