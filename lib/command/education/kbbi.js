const { default: axios } = require("axios");
const { reply, sendText } = require('../../../lib/functions')

module.exports = {
    name: 'Kamus Besar Bahasa Indonesia',
    command: ['kbbi'],
    category: 'education',
    description: '',
    async execute(msg, conn) {
        const { args, far, chat, from, } = msg;
        const query = far;
        const { data } = await axios.get(`https://new-kbbi-api.herokuapp.com/cari/${query}`);
        let kbbi = '*『 Kamus Besar BI 』*\n'
        if (data.status !== true) return await reply(from, 'Gagal mencari.. Mungkin tidak ada!', chat);
        kbbi += `*lema :* ${data.data[0].lema}\n\n`
        data.data[0].arti.forEach((v, i) => {
            kbbi += `*Kelas kata :* ${v.kelas_kata}\n`
            kbbi += `*Deskripsi :* ${v.deskripsi}\n\n`
        })
        await sendText(from, kbbi);
    }
}