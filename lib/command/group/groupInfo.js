const { sendImage, reply } = require("../../functions");

module.exports = {
    name: "Informasi Group",
    command: ['groupinfo', 'grupinfo', 'infogroup', 'infogrup'],
    category: 'group',
    desc: '➾ prefix.groupinfo [Informasi Grup]',
    async execute(msg, conn) {
        const { chat, groupMetadata, isGroup, from } = msg;
        if (isGroup) {
            const resultInfo = groupMetadata;
            const pp_group = await conn.profilePictureUrl(from, 'image');
            const date = new Date(resultInfo.creation * 1000);
            const options = {
                year: 'numeric', month: 'numeric', day: 'numeric',
            };
            let res = `*『 Informasi Grup 』*\n\n`
            res += `*➨ Nama Grup :* ${resultInfo.subject}\n`
            res += `*➨ Owner Grup :* ${resultInfo.subjectOwner !== undefined ? resultInfo.subjectOwner.replace('@c.us', '') : ''}\n`
            res += `*➨ Dibuat :* ${date.toLocaleDateString('id', options)}\n`
            res += `*➨ Pesan Sementara :* ${resultInfo.ephemeralDuration ? `${resultInfo.ephemeralDuration / 86400} Hari` : '-'}\n`
            // res += `*➨ Welcome :* ${resultAuto.welcome ? 'On' : 'Off'}\n`
            // res += `*➨ Left :* ${resultAuto.left ? 'On' : 'Off'}\n\n`
            res += `*『 Deskripsi Grup 』*\n ${resultInfo.desc}\n`
            await sendImage(from, pp_group, { capt: res });
        } else {
            reply(from, 'Maaf.. Fitur khusus info Group!', chat);
        }
    }
}