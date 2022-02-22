const { tiktokDl } = require("../../../utils/downloader");
const { addMediaSession } = require("../../../utils/sessionMedia");
const { sendButtonWithImage, reply } = require("../../functions");
const { mess } = require("../../help");

module.exports = {
    name: 'Tiktok Downloader',
    command: ['tkt', 'tiktok', 'tikdl'],
    category: 'downloader',
    isOwner: false,
    description: 'Format : prefix.tikdl <link tiktok>\nContoh: prefix.tikdl https://www.tiktok.com/@triopotatoes/video/7027492366026083611',
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
*➨ Username :* ${tkt.author.unique_id}
*➨ Nickname :* ${tkt.author.nickname}
*➨ Caption :* ${tkt.description} `

            addMediaSession({
                user_id,
                urlWm: tkt.video.with_wm,
                urlNowm: tkt.video.no_wm,
                urlMusic: tkt.music,
                type: 'tkt'
            })

            const buttons = [
                { buttonId: 'Wm', buttonText: { displayText: 'Wm' }, type: 1 },
                { buttonId: 'Nowm', buttonText: { displayText: 'Nowm' }, type: 1 },
                { buttonId: 'Music', buttonText: { displayText: 'Music' }, type: 1 }
            ]

            await sendButtonWithImage(from, buttons, 'https://i.postimg.cc/SRfVqVPd/Ephoto360-com-161bf7868c7670.jpg', { caption: capt, footer: capt_footer });
        } catch (err) {
            console.log(err);
            reply(from, mess.error.link, chat)
        }
    }
}