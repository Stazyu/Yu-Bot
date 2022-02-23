const { EmojiAPI } = require("emoji-api");
const { randomInteger } = require("../../../helpers/generate");
const { sendText, sendSticker } = require("../../functions");
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
            try {

                const emoj = (await emoji.get(args[0])).toArray();
                if (args[0] === 'list') {
                    const listEmoji = `*『 Emoji List 』*\n\n`
                    emoj.forEach((v) => {
                        listEmoji += `1. ${v.vendor}\n`
                    })
                    listEmoji += `Contoh penggunaan: ${prefix}emoji 😍 Mozilla\nNote: Huruf besar kecil harus sama sesuai di list!`;
                    return sendText(from, listEmoji);
                }
                const typeEmoj = args[1] !== undefined ? args[1][0].toUpperCase() + args[1].substring(1) : randomInteger(1, 14);
                const resEmoji = emoj.find(v => typeof typeEmoj !== 'number' ? v.vendor === typeEmoj : v.index === typeEmoj);
                const resStick = await pngToWebpFromUrl(resEmoji.url);
                console.log(resStick);
                await sendSticker(from, resStick);
                await unlink(resStick);
            } catch (err) {
                console.log(err);
            }
        }
    }
}