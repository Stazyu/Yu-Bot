const { default: axios } = require("axios");
const { facebook } = require("../../../utils/downloader");
const { reply, sendVideo } = require("../../functions");
const { mess } = require("../../help");


module.exports = {
    name: 'Facebook Downloader',
    command: ['fb', 'fbdl', 'facebook'],
    category: 'downloader',
    isOwner: false,
    description: `➾ prefix.fbdl [Download Video Facebook]
    - Format : prefix.fbdl <Link Facebook>
    - Contoh : prefix.fbdl https://fb.watch/bJHUIDms9H/`,
    async execute(msg, conn) {
        const { args, chat, far, from, prefix } = msg;
        if (args[0] === undefined) return reply(from, mess.media.fbdl.replaceAll('${prefix}', prefix), chat)
        await reply(from, mess.wait, chat)
        try {
            const link = far;
            const fb = await axios.get(`https://api.stazyu.my.id/api/downloader?url=${link}`)
            const hdMp4 = fb.data.result.hd;
            //             const capt = `*『 Facebook Downloader 』*\n
            // *➨ Title :* ${fb.result.title}
            // *➨ Size :* ${hdMp4[0].formattedSize}
            // *➨ Quality :* ${hdMp4[0].quality}
            // *➨ Extension :* ${hdMp4[0].extension}
            // *➨ Source :* ${fb.result.source}
            // `
            await sendVideo(from, hdMp4);
        } catch (err) {
            console.log(err);
            reply(from, mess.error.link, chat)
        }
    }
}