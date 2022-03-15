const { pinterest } = require("../../../utils/downloader");
const { reply, sendMedia } = require("../../functions");
const { mess } = require("../../help");


module.exports = {
    name: 'Pinterest Downloader',
    command: ['pint', 'pintdl'],
    category: 'downloader',
    isOwner: false,
    description: `➾ prefix.pintdl [Download Post Pinterest]
    - Format : prefix.pintdl <Link Pinterest>
    - Contoh : prefix.pintdl https://pin.it/6grMZzz`,
    async execute(msg, conn) {
        const { args, chat, far, from, prefix } = msg;
        if (args[0] === undefined) return await reply(from, mess.media.pintdl.replaceAll('${prefix}', prefix), chat);
        await reply(from, mess.wait, chat);
        try {
            const link = far;
            const pint = await pinterest(link);
            const capt = `*『 Pinterest Downloader 』*\n
*➨ Title :* ${pint.result.title}
*➨ Size :* ${pint.result.medias[0].formattedSize}
*➨ Quality :* ${pint.result.medias[0].quality}
*➨ Extension :* ${pint.result.medias[0].extension}
*➨ Source :* ${pint.result.source}
`
            await sendMedia(from, pint.result.medias[0].url, { caption: capt });
        } catch (err) {
            console.log(err);
            await reply(from, mess.error.link, chat)
        }
    }
}