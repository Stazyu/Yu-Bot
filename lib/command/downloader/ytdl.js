const { youtube } = require("../../../utils/downloader");
const { addMediaSession } = require("../../../utils/sessionMedia");
const { sendButtonWithImage, reply } = require("../../functions");
const { mess } = require("../../help");

module.exports = {
    name: 'Youtube Downloader',
    command: ['ytdl', 'yt'],
    category: 'downloader',
    isOwner: false,
    description: 'Format : prefix.ytdl <link youtube>\nContoh: prefix.ytdl https://youtu.be/zCJZyBcVdbs',
    async execute(msg, conn) {
        const { args, from, user_id, far, pushname, chat, prefix } = msg;
        if (args[0] === undefined) return await reply(from, mess.media.ytdl.replaceAll('${prefix}', prefix));
        const captYT = `Hai, ${pushname} 
Silahkan pilih ingin metode apa?
>> AUDIO <untuk hasil AUDIO>
>> VIDEO <untuk hasil VIDEO>
>> DOCUMENT <untuk hasil AUDIO (type document)>
Untuk penggunaanya cukup klik tombol di bawah ini.
bila anda memakai wa mod atau wa versi lawas cukup ketik aja sesuai perintah di atas.
Semoga Bermanfaat..
`
        try {
            const link = String(far);
            const result = await youtube(link);

            addMediaSession({
                user_id,
                title: result.title,
                urlMp3: String(result.detailMp3.url).replace('https://', 'http://'),
                urlMp4: String(result.detailMp4.url).includes('y2mate') ? String(result.detailMp4.url).replace('https://', 'http://') : result.detailMp4.url,
                sizeMp3: parseInt(result.detailMp3.size.split(' MB')[0]),
                sizeMp4: parseInt(result.detailMp4.size.split(' MB')[0]),
                type: 'ytdl'
            })
            const capt = `*『 YouTube Downloader 』*\n
*➨ Title :* ${result.title}
*➨ Durasi :* ${result.duration}
*➨ Bitrate :* ${result.detailMp3.quality}
*➨ Quality :* ${result.detailMp4.quality}
*➨ Size Mp3 :* ${result.detailMp3.size}
*➨ Size Mp4 :* ${result.detailMp4.size}`
            const buttons = [
                { buttonId: 'Audio', buttonText: { displayText: 'Audio' }, type: 1 },
                { buttonId: 'Video', buttonText: { displayText: 'Video' }, type: 1 },
                { buttonId: 'Document', buttonText: { displayText: 'Document (Audio Only)' }, type: 1 },
            ]
            sendButtonWithImage(from, buttons, result.thumbnail, { caption: capt, footer: captYT })
        } catch (err) {
            reply(from, mess.error.link, chat)
            console.log(err);
        }
    }
}