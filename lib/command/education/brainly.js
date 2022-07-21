const { Brainly } = require("brainly-scraper-v2");
const { sendText, reply } = require("../../functions");
const brain = new Brainly("id"); // 'id' - Default to 'id'

module.exports = {
    name: "Brainly Scraper",
    command: ['brainly', 'brain'],
    category: 'education',
    description: `➾ prefix.brainly [Mencari Jawaban di brainly]
    - Format : prefix.brainly <Pertanyaannya> <Jumlah Jawaban?>
    - Contoh : prefix.brainly Apa itu kucing? 7`,
    async execute(msg, conn) {
        const { chat, from, args, prefix } = msg;
        const tanya = args.join(' ')
        const pertanyaan = tanya.split(' | ')[0]
        if (tanya === '') return reply(from, `Format salah!\n\nKetik ${prefix}brainly [pertanyaannya | Jumalah jawaban] Abaikan [ ]`, chat)
        const jumlahBalasan = tanya.split(' | ')[1] ? tanya.split(' | ')[1] : 4
        try {
            const resultBrainly = await brain.search(pertanyaan, 'id', parseInt(jumlahBalasan));
            let textBrain = `*『 Brainly Indonesia 』*\n\n`
            resultBrainly.forEach((res, i) => {
                textBrain += `*${i + 1}.*\n`
                textBrain += `*pertanyaan:* ${res.question.content.replace('Pertanyaan', ' ')}\n`
                textBrain += `*Author:* ${res.question.author.username}\n`
                textBrain += `*Pendidikan/Pelajaran:* ${res.question.education}\n`
                textBrain += `*Level Pendidikan:* ${res.question.education_level}\n`
                textBrain += `*Tingkat Sekolah:* ${res.question.grade}\n\n`
                textBrain += `*Jawaban:* ${res.answers[0].content.replace('Jawaban:', ' ')}\n\n`
                textBrain += `--------------------------------------------\n\n`
            });
            sendText(from, textBrain)
        } catch (err) {
            reply(from, 'Maaf terjadi kesalahan.. mungkin jawaban tidak ada!', chat)
            console.log(err);
        }
    }
}