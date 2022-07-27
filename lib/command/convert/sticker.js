const { Sticker, createSticker, StickerTypes } = require('wa-sticker-formatter');
const { unlinkSync, readFileSync } = require("fs-extra");
const ffmpeg = require('fluent-ffmpeg');
const { exec } = require("child_process");
const { downloadMediaWa, sendSticker, reply, createExif } = require("../../functions");
const { mess } = require("../../help");
const Exif = require('../../functions/exif');

const exif = new Exif();


module.exports = {
    name: 'sticker',
    command: ['sticker', 'stiker', 's'],
    category: 'convert',
    isOwner: false,
    description: `➾ prefix.sticker [Merubah gambar/foto menjadi sticker]
    - Format : prefix.sticker <pack name> <full>
    - Contoh : 👇

    *Stiker Biasa* : Kirim gambar/video atau tag gambar/video dengan caption prefix.sticker (Cropped)
    
    *Stiker Full* : Kirim gambar/video atau tag gambar/video dengan caption prefix.sticker full (Full)
    
    *Stiker Biasa + WM* : Kirim gambar/video atau tag gambar/video dengan caption prefix.sticker Stazyu @wahyuhp59 (Cropped + WM)
    
    *Stiker Full + WM* : Kirim gambar/video atau tag gambar/video dengan caption prefix.sticker Stazyu @wahyuhp59 Full (Full + WM)
    `,
    async execute(msg, conn) {
        const { args, chat, command, from, type, isQuotedImage, isQuotedVideo, isQuotedSticker, prefix, user_id } = msg;
        if (type === 'imageMessage' || isQuotedImage) {
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
                const buff = await sticker.toBuffer();
                console.log(buff);
                await sendSticker(from, buff, true);
            } catch (err) {
                await reply(from, 'Gagal konversi ke sticker!', chat)
                console.log(err);
            }
        } else if (type === 'videoMessage' || isQuotedVideo) {
            // if (chat.message.videoMessage.fileLength > 10000000) return bot.reply(from, 'Gagal konversi ke stiker.. Ukuran video terlalu besar, Maks 10MB!', chat)
            // const encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(msg).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : msg
            const { path, buffer } = await downloadMediaWa(msg, '.webp');
            exif.create(args[0] !== 'full' && args[0] !== undefined ? args[0] : 'YU-BOT', args[1] ? args[1] : '@wahyuhp57')
            reply(from, mess.wait, chat)
            ffmpeg(`${path}`)
                // .inputFormat('webp')
                .on('start', function (cmd) {
                    console.log(`Started : ${cmd}`)
                })
                .on('error', function (err) {
                    console.log(`Error : ${err}`)
                    unlinkSync(path);
                    tipe = path.endsWith('.mp4') ? 'video' : 'gif'
                    reply(from, mess.error.stick, chat);
                })
                .on('end', function () {
                    console.log('Finish');
                    exec(`webpmux -set exif ./temp/data.exif ./temp/${user_id}.webp -o ./temp/${user_id}.webp`, async (error) => {
                        if (error) return reply(from, 'Maaf terjadi kesalahan, Silahkan coba kembali', chat);
                        try {
                            sendSticker(from, readFileSync(`./temp/${user_id}.webp`));
                            // console.log(`Sticker processed for ${processTime(String(t), moment())} seconds`);
                            unlinkSync(path);
                            unlinkSync(`./temp/${user_id}.webp`);
                        } catch (err) {
                            console.log(err);
                            reply(from, 'Maaf terjadi kesalahan, Silahkan coba kembali', chat);
                        }
                    })
                })
                .addOutputOptions([`-vcodec`, `libwebp`, `-vf`, `scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
                .toFormat('webp')
                .save(`./temp/${user_id}.webp`)
        } else {
            reply(from, `*Format salah!*\n\nFormat : ${prefix}sticker <pack name> <full>
Contoh : 👇

*Stiker Biasa* : Kirim gambar/video atau tag gambar/video dengan caption ${prefix}sticker (Cropped)

*Stiker Full* : Kirim gambar/video atau tag gambar/video dengan caption ${prefix}sticker full (Full)

*Stiker Biasa + WM* : Kirim gambar/video atau tag gambar/video dengan caption ${prefix}sticker Stazyu @wahyuhp59 (Cropped + WM)

*Stiker Full + WM* : Kirim gambar/video atau tag gambar/video dengan caption ${prefix}sticker Stazyu @wahyuhp59 Full (Full + WM)`, chat)
        }
    }
}