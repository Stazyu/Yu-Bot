const { facebook } = require("../../../utils/downloader");
const { reply, sendMedia } = require("../../functions");
const { mess } = require("../../help");


module.exports = {
    name: 'Facebook Downloader',
    command: ['fb', 'fbdl', 'facebook'],
    category: 'downloader',
    isOwner: false,
    description: 'Example: prefix.fbdl <linknya> | Contoh: prefix.fbdl https://fb.watch/9KDmPExb0a/',
    async execute(msg, conn) {
        const { args, chat, far, from, prefix } = msg;
        if (args[0] === undefined) return reply(from, mess.media.fbdl.replaceAll('${prefix}', prefix), chat)
        await reply(from, mess.wait, chat)
        try {
            const link = far;
            const fb = await facebook(link);
            const hdMp4 = fb.result.medias.filter(v => v.quality === 'hd')
            console.log(hdMp4);
            const capt = `*『 Facebook Downloader 』*\n
*➨ Title :* ${fb.result.title}
*➨ Size :* ${hdMp4[0].formattedSize}
*➨ Quality :* ${hdMp4[0].quality}
*➨ Extension :* ${hdMp4[0].extension}
*➨ Source :* ${fb.result.source}
`
            await sendMedia(from, hdMp4[0].url, { caption: capt });
        } catch (err) {
            console.log(err);
            reply(from, mess.error.link, chat)
        }
    }
}