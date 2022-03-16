const { instagram2, instagram } = require("../../../utils/downloader");
const { sendMedia, reply, sendVideo } = require("../../functions");
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
    description: `➾ prefix.igdl [Download Post Instagram]
    - Format : prefix.igdl <Link Instagram>
    - Contoh : prefix.igdl https://www.instagram.com/reel/CbCY1uoLQfd/?utm_source=ig_web_copy_link`,
    async execute(msg, conn) {
        const { args, chat, far, from, prefix } = msg
        try {
            if (args[0] === undefined) return await reply(from, mess.media.igdl.replaceAll('${prefix}', prefix), chat)
            await reply(from, mess.wait, chat);
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
                const link = far;
                const ig = await instagram2(link);
                for (let i = 0; i < ig.link.length; i++) {
                    if (i == 0) {
                        console.log(ig.link);
                        sendMedia(from, ig.link[i], { caption: 'Nih kak..' });
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