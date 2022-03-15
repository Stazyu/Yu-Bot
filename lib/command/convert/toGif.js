const { unlinkSync } = require("fs-extra");
const { webp2gifFile } = require("../../../utils/convert");
const { downloadMediaWa, sendVideo, reply } = require("../../functions");
const { mess } = require("../../help");

module.exports = {
    name: 'Sticker to Image',
    command: ['togif', 'tovid'],
    category: 'convert',
    isOwner: false,
    description: `➾ prefix.togif [Merubah sticker menjadi gif]
    - Format : prefix.togif 
    - Contoh : Tag sticker yang mau dijadikan gif dengan caption prefix.togif`,
    async execute(msg, conn) {
        const { chat, command, from, type, isQuotedSticker } = msg;
        if (command === 'togif' && type === 'stickerMessage' || isQuotedSticker) {
            await reply(from, mess.wait, chat);
            const { path, buffer } = await downloadMediaWa(msg, '.webp');
            webp2gifFile(path)
                .then(async (res) => {
                    await sendVideo(from, res, { caption: 'Done. Konversi ke Gif!', gifPlayback: true });
                    unlinkSync(path);
                }).catch(async (err) => {
                    await reply(from, 'Gagal konversi ke Video!', chat);
                    unlinkSync(path);
                    console.log(err);
                });
        } else if (command === 'tovid' && type === 'stickerMessage' || isQuotedSticker) {
            await reply(from, mess.wait, chat);
            const { path, buffer } = await downloadMediaWa(msg, '.webp');
            webp2gifFile(path)
                .then(async (res) => {
                    await sendVideo(from, res, { caption: 'Done. Konversi ke Video!' });
                    unlinkSync(path);
                }).catch(async (err) => {
                    await reply(from, 'Gagal konversi ke Video!', chat);
                    unlinkSync(path);
                    console.log(err);
                });
        }
    }
}