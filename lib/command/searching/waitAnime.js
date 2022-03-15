const { default: axios } = require("axios");
const { unlinkSync } = require("fs-extra");
const { upToTele } = require("../../../utils/convert");
const { reply, downloadMediaWa, sendMedia } = require("../../functions");
const { mess } = require("../../help");


module.exports = {
    name: "Wait Anime",
    command: ['wait', 'whatanime'],
    category: 'searching',
    description: `➾ prefix.wait [Search Anime by image]
    -Format : prefix.wait <Tag foto anime>`,
    async execute(msg, conn) {
        const { isMedia, chat, isQuotedImage, from, prefix } = msg;
        if (isMedia && chat.message.imageMessage || chat.message.viewOnceMessage || isQuotedImage) {
            reply(from, mess.wait, chat);
            const { buffer, path } = await downloadMediaWa(msg);
            const link = await upToTele(buffer);
            let whatAnime = `*『 Search Anime by Image 』*\n\n`
            axios.get(`https://api.trace.moe/search?anilistInfo&url=${encodeURIComponent(link)}`)
                .then(async (res) => {
                    try {
                        const { anilist, filename, episode, similarity, video, image } = res.data.result[0]
                        const { idMal, title, synonyms, isAdult } = anilist
                        whatAnime += `Judul Jepang : ${title.native}\n`
                        whatAnime += `Judul Romaji : ${title.romaji}\n`
                        whatAnime += `Judul english : ${title.english}\n`
                        whatAnime += `Persamaan : ${synonyms[0] ? synonyms[0] : 'Tidak ada'}\n`
                        whatAnime += `Episode : ${episode}\n`
                        whatAnime += `Adult : ${isAdult ? '✅' : '❌'}\n`
                        whatAnime += `File Name : ${filename}\n`
                        await sendMedia(from, video, { caption: whatAnime, quoted: chat });
                    } catch (err) {
                        console.log(err);
                        reply(from, mess.error.link, chat);
                    }
                }).catch((err) => {
                    console.log(err);
                });
            unlinkSync(path);
        } else {
            reply(from, `Tag atau kirim image dengan caption ${prefix}wait`)
        }
    }
}