const ffmpeg = require('fluent-ffmpeg');
const { exec } = require('child_process');
const { downloadMediaWa, reply, sendAudio } = require('../../functions');
const { randomString } = require('../../../helpers/generate');
const { mess } = require('../../help');
const { unlink } = require('fs').promises;

module.exports = {
    name: 'Video to Audio',
    command: ['toaudio', 'tomp3'],
    category: 'convert',
    isOwner: false,
    description: 'Example : Tag Video dengan caption prefix.tomp3',
    async execute(msg, conn) {
        const { chat, from, type, isQuotedVideo } = msg;
        if (type === 'videoMessage' || isQuotedVideo) {
            await reply(from, mess.wait, chat);
            const { path, buffer } = await downloadMediaWa(msg, '.mp4');
            const out = `./temp/${randomString(4)}.mp3`
            exec(`ffmpeg -i ${path} -vn -ar 44100 -ac 2 -ab 320 -f mp3 ${out}`, async (err) => {
                if (err) return reply(from, 'Gagal konversi ke Audio!', chat);
                await sendAudio(from, out, { mimetype: 'audio/mp4' });
                await unlink(path);
                await unlink(out);
            })
        }
    }
}