const yts = require('yt-search');
const { youtube } = require('../../../utils/downloader');
const { addMediaSession } = require("../../../utils/sessionMedia");
const { sendButtonWithImage, reply } = require('../../functions');
const { mess } = require('../../help');

module.exports = {
    name: 'Play Youtube Downloader',
    command: ['play', 'playyt'],
    category: 'downloader',
    isOwner: false,
    description: 'Format : prefix.play <Nama Lagu>\nContoh: prefix.play Night Changes',
    async execute(msg, conn) {
        const { chat, from, far, prefix, pushname, user_id } = msg
        const query = String(far);
        if (query === '') return reply(from, `*Format salah!*\n\nPenggunaan: ${prefix}play <judul lagu>\nContoh: ${prefix}play Night Changes`)
        try {
            const yt = await yts(query)
            const url = yt.all[0].url
            const resultYt = await youtube(url)
            const captPlay = `Hai, ${pushname} 
Silahkan pilih ingin metode apa?

>> AUDIO <untuk hasil AUDIO>
>> VIDEO <untuk hasil VIDEO>
>> DOCUMENT <untuk hasil AUDIO (type document)>

Untuk penggunaanya cukup klik tombol di bawah ini.

bila anda memakai wa mod atau wa versi lawas cukup ketik aja sesuai perintah di atas.

Semoga Bermanfaat..
`
            addMediaSession({
                user_id,
                title: resultYt.title,
                urlMp3: String(resultYt.detailMp3.url).replace('https://', 'http://'),
                urlMp4: String(resultYt.detailMp4.url).includes('y2mate') ? String(resultYt.detailMp4.url).replace('https://', 'http://') : resultYt.detailMp4.url,
                sizeMp3: parseInt(resultYt.detailMp3.size.split(' MB')[0]),
                sizeMp4: parseInt(resultYt.detailMp4.size.split(' MB')[0]),
                type: 'ytdl'
            })
            const capt = `*『 Play YouTube Downloader 』*\n
*➨ Title :* ${resultYt.title}
*➨ Durasi :* ${resultYt.duration}
*➨ Bitrate :* ${resultYt.detailMp3.quality}
*➨ Quality :* ${resultYt.detailMp4.quality}
*➨ Size Mp3 :* ${resultYt.detailMp3.size}
*➨ Size Mp4 :* ${resultYt.detailMp4.size}`

            const buttons = [
                { buttonId: 'Audio', buttonText: { displayText: 'Audio' }, type: 1 },
                { buttonId: 'Video', buttonText: { displayText: 'Video' }, type: 1 },
                { buttonId: 'Document', buttonText: { displayText: 'Document (Audio Only)' }, type: 1 },
            ]
            await sendButtonWithImage(from, buttons, resultYt.thumbnail, { caption: capt, footer: captPlay });
        } catch (err) {
            reply(from, mess.error.link, chat)
            console.log(err);
        }
    }
}
