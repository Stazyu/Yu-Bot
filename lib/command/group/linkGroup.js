const { reply, sendText } = require("../../functions");
const { mess } = require("../../help");


module.exports = {
    name: "Ambil link Group",
    command: ['linkgroup', 'linkgc', 'linkgrup'],
    category: 'group',
    isGroupAdmin: true,
    desc: `➾ prefix.linkgroup [Untuk mengambil link grup]`,
    async execute(msg, conn) {
        const { chat, botNumber, from, isGroup, groupName, groupAdmins } = msg;
        try {
            // Cek apakah di dalam group
            if (!isGroup) return await reply(from, 'Maaf, fitur hanya bisa digunakan di Group!', chat)
            // Cek apakah bot admin
            const isBotAdmin = groupAdmins.includes(botNumber);
            if (!isBotAdmin) return await reply(from, 'Gagal ambil link group, pastikan bot sudah menjadi admin!');
            const code = await conn.groupInviteCode(from);
            console.log(code);
            await sendText(from, `Link Group ${groupName} : https://chat.whatsapp.com/${code}`);
        } catch (err) {
            await reply(from, mess.error.system, chat);
            console.log(err);
        }
    }
}