const { reply, sendText } = require("../../functions");


module.exports = {
    name: "Buka dan Tutup Group",
    command: ['group', 'gc'],
    category: 'group',
    isGroupAdmin: true,
    desc: `➾ prefix.group [Untuk membuka atau menutup grup]
    - Format : prefix.group <open atau close>
    - Contoh : prefix.group open`,
    async execute(msg, conn) {
        const { args, chat, from, prefix, groupAdmins, botNumber, isGroup, groupName } = msg;
        try {
            // Cek eksekusi command
            if (!isGroup) return await reply(from, 'Maaf, fitur hanya bisa digunakan di Group!', chat);
            // Cek apakah bot admin
            const isBotAdmin = groupAdmins.includes(botNumber);
            if (args[0] === 'open') {
                if (!isBotAdmin) return await reply(from, `Gagal buka Group, pastikan bot sudah menjadi admin group!`, chat)
                await conn.groupSettingUpdate(from, "not_announcement")
                await sendText(from, `Perintah diterima, berhasil buka Group ${groupName}`)
            } else if (args[0] === 'close') {
                if (!isBotAdmin) return await reply(from, `Gagal tutup Group, pastikan bot sudah menjadi admin group!`, chat)
                await conn.groupSettingUpdate(from, "announcement")
                await sendText(from, `Perintah diterima, berhasil tutup Group ${groupName}`)
            } else {
                await reply(from, `Format salah, Silahkan ketik ${prefix}group open | close`)
            }
        } catch (err) {
            await reply(from, 'Ada masalah di server, silahkan lapor ke owner bot', chat)
            console.log(err);
        }
    }
}