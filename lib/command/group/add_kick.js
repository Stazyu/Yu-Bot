const { sendText, reply } = require("../../functions");

module.exports = {
    name: "Kick member",
    command: ['add', 'kick'],
    category: "group",
    isAdminGroup: true,
    description: `➾ prefix.add [Menambahkan orang ke grup]
    - Format : prefix.add <tag membernya>
    - Contoh : prefix.add @628171349476
➾ prefix.kick [Mengeluarkan orang dari grup]
    - Format : prefix.kick <tag membernya>
    - Contoh : prefix.kick @628393749407`,
    async execute(msg, conn) {
        const { args, chat, command, from, mentionedJid, groupAdmins, botNumber, isGroup, prefix } = msg;
        if (!isGroup) return await reply(from, 'Maaf, fitur hanya bisa digunakan di Group!', chat)
        const isBotAdmin = groupAdmins.some(v => v === botNumber)
        try {
            if (!isBotAdmin) return await reply(from, `Gagal Menambahkan, pastikan bot sudah menjadi admin group!`, chat);
            if (command === 'add') {
                if (args[0] !== undefined) {
                    const jidNumber = formatter(args[0], '@s.whatsapp.net');
                    const response = await conn.groupParticipantsUpdate(
                        from,
                        [jidNumber],
                        "add" // replace this parameter with "add", "remove", "demote" or "promote"
                    )
                    await sendText(from, `Perintah diterima, menambahkan : @${jidNumber.split('@')[0]}`, { mentions: [mentionedJid] });
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
        } catch (err) {
            console.log(err);
        }
    }
}

// Formatter number 0 to 62
function formatter(number, standard = "@c.us") {
    let formatted = number;
    // const standard = '@c.us'; // @s.whatsapp.net / @c.us
    if (!String(formatted).endsWith("@g.us")) {
        // isGroup ? next
        // 1. Menghilangkan karakter selain angka
        formatted = number.replace(/\D/g, "");
        // 2. Menghilangkan angka 62 di depan (prefix)
        //    Kemudian diganti dengan 0
        if (formatted.startsWith("0")) {
            formatted = "62" + formatted.slice(1);
        }
        // 3. Tambahkan standar pengiriman whatsapp
        if (!String(formatted).endsWith(standard)) {
            formatted += standard;
        }
    }
    return formatted;
}