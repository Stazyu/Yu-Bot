const { igApi } = require('insta-fetcher');

const { instagram2, instagram } = require("../../../utils/downloader");
const { sendMedia, reply, sendVideo, sendText } = require("../../functions");
const { mess } = require("../../help");

const ig = new igApi(process.env.IG_SESSIONID);


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
            const igdl = await ig.fetchPost(link);
            const capt = `*『 Instagram Downloader 』*

*➨ Username :* ${igdl.username}
*➨ Name :* ${igdl.name}
*➨ Quality :* Original
*➨ Type :* ${igdl.links[0].type}

*➨ Caption :* ${igdl.caption}
`
            for (let i = 0; i < igdl.links.length; i++) {
                if (i === 0) {
                    await sendMedia(from, igdl.links[i].url, { caption: capt, quoted: chat });
                } else {
                    await sleep(3000);
                    await sendMedia(from, igdl.links[i].url);
                }
            }
        } catch (err) {
            await reply(from, mess.error.link, chat);
            console.log(err);
        }
    }
}