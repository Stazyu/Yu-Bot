const { EmojiAPI } = require("emoji-api");
const { unlink } = require("fs-extra").promises;
const emoji = new EmojiAPI();
const { default: axios } = require('axios')
const caliphApi = require('caliph-api');

const { randomInteger } = require("../../../helpers/generate");
const { sendText, sendSticker, reply } = require("../../functions");
const { pngToWebpFromUrl } = require('../../../utils/convert');

module.exports = {
    name: "Convert emoji ke sticker atau gambar",
    command: ['emoji', 'emojics', 'emojicustom', 'emojimix'],
    category: 'convert',
    description: '',
    async execute(msg, conn) {
        const { args, far, chat, command, from, prefix } = msg;
        if (command === 'emoji') {
            if (args[0] === undefined) return reply(from, `Format salah, emoji tidak ada!\nUntuk melihat list emoji silahkan ketik ${prefix}emoji <Emoji> list\n\nContoh : ${prefix}emoji ☺️ list`)
            try {
                const emoj = (await emoji.get(args[0])).toArray();
                if (args[1] === 'list') {
                    let listEmoji = `*『 Emoji List 』*\n\n`
                    emoj.forEach((v, i) => {
                        listEmoji += `${i + 1}. ${v.vendor}\n`
                    })
                    listEmoji += `Contoh penggunaan: ${prefix}emoji ${args[0]} 2\n\nNote : Angka belakang opsional, kalo gapake otomatis random type emojinya`;
                    return sendText(from, listEmoji);
                }
                // const typeEmoj = args[1] !== undefined ? args[1][0].toUpperCase() + args[1].substring(1) : randomInteger(1, 14);
                const typeEmoj = args[1] !== undefined ? args[1] : randomInteger(1, 14);
                const resEmoji = emoj.find(v => v.index == typeEmoj);
                const resStick = await pngToWebpFromUrl(resEmoji.url);
                await sendSticker(from, resStick);
                await unlink(resStick);
            } catch (err) {
                await reply(from, 'Emoji tidak tersedia!', chat);
                console.log(err);
            }
        } else if (command !== 'emoji') {
            const e = args.join(' ');
            const emoji1 = e.split('|')[0];
            const emoji2 = e.split('|')[1];
            console.log(emoji1, emoji2);
            // axios.get(`https://emojimix-api.justcaliph.tech/api/v1/${encodeURIComponent(emoji1)}/${encodeURIComponent(emoji2)}`)
            caliphApi.other.emojimix(emoji1, emoji2)
                .then((res) => {
                    console.log(res.buffer());
                }).catch((err) => {
                    console.log(err);
                });
        }
    }
}