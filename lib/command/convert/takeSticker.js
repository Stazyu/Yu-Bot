const { unlinkSync } = require("fs-extra");
const { Sticker, StickerTypes } = require("wa-sticker-formatter");
const { downloadMediaWa, reply, sendSticker } = require("../../functions");

module.exports = {
    name: 'Ubah Packname Sticker',
    command: ['take', 'editsticker'],
    category: 'convert',
    isOwner: false,
    description: `Example: Tag sticker dengan caption prefix.take nama pack | nama author`,
    async execute(msg, conn) {
        const { args, chat, isQuotedSticker, user_id, from } = msg;
        if (isQuotedSticker) {
            try {
                const { path, buffer } = await downloadMediaWa(msg, '.webp', user_id)
                const pack = args.join(' ')
                const packName = pack.split('|')[0] !== undefined ? pack.split('|')[0] : 'Yu-Bot'
                const authorName = pack.split('|')[1] !== undefined ? pack.split('|')[1] : '@wahyuhp57'
                const sticker = new Sticker(buffer, {
                    pack: packName,
                    author: authorName,
                    type: StickerTypes.FULL,
                    quality: 80,
                })
                unlinkSync(path);
                const buff = await sticker.toBuffer();
                await sendSticker(from, buff);
            } catch (err) {
                console.log(err);
            }
        } else {
            reply(from, 'Tag stiker yang mau di ubah watermarknya!, Contoh: !take Yu-Bot | @wahyuhp57', chat)
        }
    }
}