const { EmojiAPI } = require("emoji-api");
const { randomInteger } = require("../../../helpers/generate");
const { sendText, sendSticker, reply } = require("../../functions");
const { pngToWebpFromUrl } = require('../../../utils/convert');
const { unlink } = require("fs-extra").promises;
const emoji = new EmojiAPI();

module.exports = {
    name: "Convert emoji ke sticker atau gambar",
    command: ['emoji', 'emojics', 'emojicustom'],
    category: 'convert',
    description: '',
    async execute(msg, conn) {
        const { args, far, chat, command, from, prefix } = msg;
        if (command === 'emoji') {
            if (args[0] === null) return reply(from, `Format salah, emoji tidak ada!\nUntuk melihat list emoji silahkan ketik ${prefix}emoji <Emoji> list\n\nContoh : ${prefix}emoji ☺️ list`)
            try {
                const emoj = (await emoji.get(args[0])).toArray();
                if (args[1] === 'list') {
                    let listEmoji = `*『 Emoji List 』*\n\n`
                    emoj.forEach((v, i) => {
                        listEmoji += `${i + 1}. ${v.vendor}\n`
                    })
                    listEmoji += `Contoh penggunaan: ${prefix}emoji ${args[0]} Mozilla\n\nNote: Huruf besar kecil harus sama sesuai di list!`;
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
        }
    }
}