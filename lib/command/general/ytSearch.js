const yts = require("yt-search");
const { sendImage, reply } = require("../../functions");


module.exports = {
    name: "Pencarian Youtube",
    command: ['ytsearch'],
    category: 'general',
    description: '',
    async execute(msg, conn) {
        const { chat, far, from, prefix } = msg;
        if (!far) return reply(from, `Format salah, ketik ${prefix}ytsearch <judulnya>`, chat)
        yts.search(far, async (err, data) => {
            if (err) return reply(from, `Maaf terjadi kesalahan, mungkin judul tidak ditemukan atau ada masalah di sistem!`, chat);
            let resultYt = '*『 Youtube Search 』*\n\n'
            for (let i in data.all) {
                if (data.all[i].type === 'video') {
                    if (i < 10) {
                        resultYt += `*➨ Title :* ${data.all[i].title}\n`
                        resultYt += `*➨ ID :* ${data.all[i].videoId}\n`
                        resultYt += `*➨ Views :* ${data.all[i].views}\n`
                        resultYt += `*➨ Durasi :* ${data.all[i].timestamp}\n`
                        resultYt += `*➨ Publikasi :* ${data.all[i].ago}\n`
                        resultYt += `*➨ Channel :* ${data.all[i].author.name}\n`
                        resultYt += `*➨ Description :* ${data.all[i].description}\n\n`
                        resultYt += `*➨ Link :* ${data.all[i].url}\n`
                        resultYt += `-----------------------------------------\n\n`
                    }
                }
            }
            await sendImage(from, data.all[0].thumbnail, { capt: resultYt });
        })
    }
}