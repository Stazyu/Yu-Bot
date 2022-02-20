const { downloadMediaWa, sendSticker, reply } = require("../../functions");
const { Sticker, createSticker, StickerTypes } = require('wa-sticker-formatter');
const { unlinkSync } = require("fs-extra");


module.exports = {
    name: 'sticker',
    command: ['sticker', 'stiker'],
    category: 'convert',
    isOwner: false,
    description: `Example: 
    Stiker Biasa : Kirim gambar/video atau tag gambar/video dengan caption prefix.sticker (Cropped)
    Stiker Full : Kirim gambar/video atau tag gambar/video dengan caption prefix.sticker full (Full)
    Stiker Biasa + WM : Kirim gambar/video atau tag gambar/video dengan caption prefix.sticker Stazyu @wahyuhp59 (Cropped + WM)
    Stiker Full + WM : Kirim gambar/video atau tag gambar/video dengan caption prefix.sticker Stazyu @wahyuhp59 Full (Full + WM)
    `,
    async execute(msg, conn) {
        const { args, chat, command, from, type, isQuotedImage, isQuotedVideo, isQuotedSticker, prefix, user_id } = msg;
        if ((type === 'imageMessage' || type === 'videoMessage') || (isQuotedImage || isQuotedVideo)) {
            try {
                const { path, buffer } = await downloadMediaWa(msg, '.webp')
                const full = args.join(' ').includes('full');
                const sticker = new Sticker(buffer, {
                    pack: args[0] !== 'full' && args[0] !== undefined ? args[0] : 'YU-BOT', // The pack name
                    author: args[1] ? args[1] : '@wahyuhp57', // The author name
                    type: full ? StickerTypes.FULL : StickerTypes.CROPPED, // The sticker type
                    categories: ['🤩', '🎉'], // The sticker category
                    // id: '12345', // The sticker id
                    quality: 80, // The quality of the output file
                    // background: '#000000' // The sticker background color (only for full stickers)
                })
                unlinkSync(path);
                const buff = await sticker.toBuffer()
                await sendSticker(from, buff);
            } catch (err) {
                await reply(from, 'Gagal konversi ke sticker!', chat)
                console.log(err);
            }
        } else {
            reply(from, `*Format salah!*\n\nFormat: kirim gambar/video atau tag gambar/video dengan caption ${prefix}sticker`, chat)
        }
    }
}