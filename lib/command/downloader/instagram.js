const { instagram2, instagram } = require("../../../utils/downloader");
const { sendMedia, reply } = require("../../functions");
const { mess } = require("../../help");

const sleep = (delayInms) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(2);
        }, delayInms);
    });
}

module.exports = {
    name: 'Instagram Downloader',
    command: ['ig', 'igdl', 'instagram'],
    category: 'downloader',
    isOwner: false,
    description: 'Format : prefix.igdl <link instagram>\nContoh: prefix.igdl https://www.instagram.com/p/CXI0jIdAnf-/?utm_source=ig_web_copy_link',
    async execute(msg, conn) {
        const { args, chat, far, from } = msg
        if (args[0] === undefined) return await reply(from, mess.media.igdl.replaceAll('${prefix}', prefix), chat)
        await reply(from, mess.wait, chat);
        try {
            const link = far
            const ig = await instagram(link);
            const capt = `*『 Instagram Downloader 』*

*➨ Title :* ${ig.result.title}
*➨ Size :* ${ig.result.medias[0].formattedSize}
*➨ Quality :* ${ig.result.medias[0].quality}
*➨ Extension :* ${ig.result.medias[0].extension}
*➨ Source :* ${ig.result.source}
`
            for (let i = 0; i < ig.result.medias.length; i++) {
                if (i === 0) {
                    sendMedia(from, ig.result.medias[i].url, { caption: capt, quoted: chat });
                } else {
                    await sleep(3000);
                    sendMedia(from, ig.result.medias[i].url);
                }
            }
        } catch {
            try {
                const link = far
                const ig = await instagram2(link)
                console.log(ig);
                for (let i = 0; i < ig.link.length; i++) {
                    if (i === 0) {
                        sendMedia(from, ig.link[i], { caption: 'Nih kak..', quoted: chat });
                    } else {
                        await sleep(3000);
                        sendMedia(from, ig.link[i]);
                    }
                }
            } catch (err) {
                console.log(err);
                reply(from, mess.error.link, chat);
            }
        }
    }
}