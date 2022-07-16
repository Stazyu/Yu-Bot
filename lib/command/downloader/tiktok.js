const { tiktokDl, tiktok } = require("../../../utils/downloader");
const { addMediaSession } = require("../../../utils/sessionMedia");
const { sendButtonWithImage, reply } = require("../../functions");
const { mess } = require("../../help");

module.exports = {
    name: 'Tiktok Downloader',
    command: ['tkt', 'tiktok', 'tikdl'],
    category: 'downloader',
    isOwner: false,
    description: `➾ prefix.tikdl [Download Post Tiktok]
    - Format : prefix.tikdl <Link Tiktok>
    - Contoh : prefix.tikdl https://www.tiktok.com/@triopotatoes/video/7027492366026083611`,
    async execute(msg, conn) {
        const { args, chat, from, far, user_id, prefix } = msg;
        if (args[0] === undefined) return reply(from, mess.media.tikdl.replaceAll('${prefix}', prefix), chat)
        const capt_footer = `Silahkan pilih ingin metode apa?\n
>> WM <untuk hasil DENGAN WATERMARK>
>> NOWM <untuk hasil TANPA WATERMARK>
>> MUSIC <untuk hasil KHUSUS MUSIK>

Untuk penggunaanya cukup klik tombol di bawah ini.

bila anda memakai wa mod atau wa versi lawas cukup ketik aja sesuai perintah di atas.

Semoga Bermanfaat..`
        try {
            const link = far;
            const tkt = await tiktokDl(link);
            console.log(tkt);
            const capt = `*『 Tiktok Downloader 』*\n
*➨ Username :* ${tkt.info.username}
*➨ Nickname :* ${tkt.info.nickname}
*➨ Caption :* ${tkt.info.desc} 
*➨ Waktu dibuat :* ${tkt.info.created} 
            `
            //             const capt = `*『 Tiktok Downloader 』*\n
            // *➨ Username :* ${tkt.author_id}
            // *➨ Nickname :* ${tkt.author_name}
            // *➨ Caption :* ${tkt.desc} 
            // *➨ Waktu dibuat :* ${tkt.create_time} 
            // `

            addMediaSession({
                user_id,
                urlWm: tkt.data.wm,
                urlNowm: tkt.data.nowm,
                urlMusic: tkt.data.music,
                type: 'tkt'
            })

            const buttons = [
                { buttonId: 'Wm', buttonText: { displayText: 'Wm' }, type: 1 },
                { buttonId: 'Nowm', buttonText: { displayText: 'Nowm' }, type: 1 },
                { buttonId: 'Music', buttonText: { displayText: 'Music' }, type: 1 }
            ]

            await sendButtonWithImage(from, buttons, tkt.info.image, { caption: capt, footer: capt_footer });
        } catch (err) {
            console.log(err);
            reply(from, mess.error.link, chat)
        }
    }
}