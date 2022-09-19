const downloader = require("../../../utils/downloader");
const { tiktokDl, tiktok, tiktokDl2 } = require("../../../utils/downloader");
const { addMediaSession } = require("../../../utils/sessionMedia");
const { sendButtonWithImage, reply, getBuffer } = require("../../functions");
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
            const capt = `*『 Tiktok Downloader 』*\n
*➨ Username :* ${tkt.info.username}
*➨ Nickname :* ${tkt.info.nickname}
*➨ Caption :* ${tkt.info.desc} 
*➨ Waktu dibuat :* ${tkt.info.created} 
            `

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

            await sendButtonWithImage(from, buttons, tkt.info.image, { caption: capt, footer: capt_footer, viewOnce: false });
        } catch (err) {
            try {
                const capt_footer = `Silahkan pilih ingin metode apa?\n
>> WM <untuk hasil DENGAN WATERMARK>
>> NOWM <untuk hasil TANPA WATERMARK>
>> MUSIC <untuk hasil KHUSUS MUSIK>

Untuk penggunaanya cukup klik tombol di bawah ini.

bila anda memakai wa mod atau wa versi lawas cukup ketik aja sesuai perintah di atas.

Semoga Bermanfaat..`
                const link = far;
                const tkt = await tiktokDl2(link);
                console.log(tkt);
                const capt = `*『 Tiktok Downloader 』*\n
*➨ Username :* ${tkt.author.unique_id}
*➨ Nickname :* ${tkt.author.nickname}
*➨ Region :* ${tkt.region}
*➨ Title Musik :* ${tkt.music_info.title} 
*➨ Waktu dibuat :* ${tkt.create_time_format}

*➨ Caption :* ${tkt.title}`
                addMediaSession({
                    user_id,
                    urlWm: tkt.wmplay,
                    urlNowm: tkt.hdplay,
                    urlMusic: tkt.music,
                    type: 'tkt'
                })

                const buttons = [
                    { buttonId: 'Wm', buttonText: { displayText: 'Wm' }, type: 1 },
                    { buttonId: 'Nowm', buttonText: { displayText: 'Nowm' }, type: 1 },
                    { buttonId: 'Music', buttonText: { displayText: 'Music' }, type: 1 }
                ]

                await sendButtonWithImage(from, buttons, 'https://i.ibb.co/QQK1sPZ/Tiktok.jpg', { caption: capt, footer: capt_footer, viewOnce: false });
            } catch (error) {
                console.log(error);
                reply(from, mess.error.link, chat)
            }
        }
    }
}