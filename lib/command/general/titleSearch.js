const acrcloud = require("acrcloud");
const { unlinkSync } = require("fs-extra");
const { downloadMediaWa, reply } = require("../../functions");
const acr = new acrcloud({
    host: "identify-eu-west-1.acrcloud.com",
    access_key: "0dd8773c46d5a3434e362b7ab833ad5b",
    access_secret: "n0cEH3vIezUEJFBnWUpce1FiTECNp2PaDSrsSjtm"
});

module.exports = {
    name: "Mencari judul lagu lewat lagu",
    command: ['searchtitle', 'searchttl', 'titlesearch', 'judul'],
    category: 'general',
    description: `➾ prefix.titlesearch [Cari judul lagu dari music yang dikirim] 
    - Format : prefix.titlesearch <Tag audio yang dikirim>`,
    async execute(msg, conn) {
        const { chat, from, isMedia, isAudio, isQuotedAudio, prefix } = msg;
        if (isMedia && isAudio && chat.message.audioMessage || isQuotedAudio) {
            // if (!verify) return bot.reply(from, `Anda belum melakukan verifikasi, untuk verifikasi ketik ${prefix}verify`, chat)
            await reply(from, 'Mengindetifikasi lagu.. 🔍', chat)
            const { path, buffer } = await downloadMediaWa(msg, '.mp3')
            acr.identify(buffer)
                .then((metadata) => {
                    console.log(metadata.metadata.music[0]);
                    const jawabanlagunya = (
                        ` *『 Title Searching 』*
Judul: ${metadata.metadata?.music[0]?.title}
Artis: ${metadata.metadata?.music[0]?.artists[0].name}
Album: ${metadata.metadata?.music[0]?.album.name}
Rilis: ${metadata.metadata?.music[0]?.release_date}
Genre: ${metadata.metadata?.music[0]?.genres !== undefined ? metadata.metadata?.music[0]?.genres[0]?.name : null}
Label: ${metadata.metadata?.music[0]?.label}`)
                    reply(from, jawabanlagunya, chat)
                    unlinkSync(path);
                })
                .catch((err) => {
                    reply(from, 'Title tidak ditemukan!', chat)
                    console.log(err);
                    unlinkSync(path);
                })
        } else {
            reply(from, `*Format salah!*\n\nFormat : Tag audio dengan caption ${prefix}titlesearch`)
        }
    }
}