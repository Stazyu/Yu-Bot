const { exec } = require('child_process');
const { unlinkSync } = require('fs');
const path = require('path');

const { randomString } = require('../../../helpers/generate');
const { downloadMediaWa, sendImage } = require('../../functions');

module.exports = {
    name: 'Sticker to Image',
    command: ['toimg', 'toimage'],
    category: 'convert',
    isOwner: false,
    description: 'Example: Tag sticker dengan caption prefix.toimg',
    async execute(msg, conn) {
        const { from, type, isQuotedSticker } = msg;
        if (type === 'stickerMessage' || isQuotedSticker) {
            const out = path.join(__dirname, '../../../temp', randomString(4, { extension: '.png' }));
            const { path: pathOut, buffer } = await downloadMediaWa(msg, '.webp');
            exec(`ffmpeg -i ${pathOut} ${out}`, async (err) => {
                if (err) throw new Error('Gagal konversi stiker ke gambar!');
                await sendImage(from, out, { capt: 'Done. Konversi stiker ke gambar!' });
                unlinkSync(out);
                unlinkSync(pathOut);
            })
        }
    }
}