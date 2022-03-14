const { default: axios } = require("axios");
const { args } = require("fluent-ffmpeg/lib/utils");
const { sendText, sendAudio, sendTemplateButton, sendButton, reply } = require("../../functions");
const { addMediaSession } = require('../../../utils/sessionMedia');
const { mess } = require("../../help");

module.exports = {
    name: 'Islami',
    command: ['alquran', 'quran'],
    category: 'education',
    description: '',
    async execute(msg, conn) {
        const { args, chat, from, user_id } = msg;
        if (args[0] === 'list') {
            try {
                console.log('Aman');
                const quran = await axios.get(`https://quran-endpoint.vercel.app/quran`);
                const data = quran.data.data;
                let result = '*『 List Surah Al-Quran 』*\n\n';
                data.forEach((v, i) => {
                    result += `${v.number}. ${v.asma.id.short}\n`
                })
                await sendText(from, result)
            } catch (err) {
                await reply(from, mess.error.link, chat)
                console.log(err);
            }
        } else if (args.length >= 2) {
            try {
                const quran = await axios.get(`https://quran-endpoint.vercel.app/quran/${args[0]}/${args[1]}`);
                const data = quran.data.data;
                const surah = data.surah;
                const ayah = data.ayah;
                addMediaSession({
                    user_id,
                    type: 'ayah',
                    title: surah.id.short + args[1],
                    audio: ayah.audio.url
                })
                let result = '*『 Al-Quran 』*\n\n';
                result += `Nama Surah: ${surah.id.short}\n`
                result += `Arti Surah: ${surah.translation.id}\n`
                result += `Juz: ${ayah.juz}\n`
                // result += `Diturunkan: ${ayah.type}`
                result += `Ayah: ${ayah.text.ar}\n`
                result += `Tafsir: ${ayah.tafsir.id}\n`
                const buttons = [
                    { buttonId: 'audioquran', buttonText: { displayText: 'Audio' }, type: 1 },
                    { buttonId: 'docquran', buttonText: { displayText: 'Document (Audio)' }, type: 1 }
                ]
                await sendButton(from, buttons, { text: result });
                // await sendAudio(from, ayah.audio.url);
            } catch (err) {
                await reply(from, mess.error.link, chat)
                console.log(err);
            }
        } else if (args.length == 1) {
            try {
                const quran = await axios.get(`https://quran-endpoint.vercel.app/quran/${args[0]}`);
                const data = quran.data.data;
                addMediaSession({
                    user_id,
                    title: data.asma.id.short,
                    audio: data.recitation.full,
                    type: 'ayah',
                })
                let result = '*『 Al-Quran 』*\n\n';
                result += `Nama Surah : ${data.asma.id.short}\n`
                result += `Arti Surah : ${data.asma.translation.id}\n`
                result += `Diturunkan : ${data.type.id}\n`
                result += `Jumlah Ayah : ${data.ayahCount}\n`
                result += `Tafsir : ${data.tafsir.id}\n\n`
                data.ayahs.forEach((v, i) => {
                    result += `${i + 1}. ${v.text.ar}\n`;
                })
                const buttons = [
                    { buttonId: 'audioquran', buttonText: { displayText: 'Audio' }, type: 1 },
                    { buttonId: 'docquran', buttonText: { displayText: 'Document (Audio)' }, type: 1 }
                ]
                await sendButton(from, buttons, { text: result });
            } catch (err) {
                await reply(from, mess.error.link, chat)
                console.log(err);
            }
        }
    }
}