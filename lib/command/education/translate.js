const translate = require('@vitalets/google-translate-api');
const { sendText, reply } = require('../../functions');

module.exports = {
    name: 'Terjemahan Bahasa',
    command: ['translate'],
    category: 'education',
    description: `➾ prefix.translate [Mencari kata di KBBI]
    - Format : prefix.translate <kata>
    - Contoh : prefix.translate Kucing Lucu`,
    async execute(msg, conn) {
        const { args, far, chat, from, } = msg;
        const query = far.split(args[0])[1];
        try {
            const tr = await translate(query, { to: args[0] });
            const text = `
*Terjemahan by Google Translate*

*Query* : ${query}
*to* : ${args[0]}

*Result* : ${tr.text}`
            sendText(from, text);
        } catch (err) {
            await reply(from, mess.error.link, chat)
            console.log(err);
        }
    }
}

// translate('Ik spreek Engels', { to: 'en' }).then(res => {
//     console.log(res.text);
//     //=> I speak English
//     console.log(res.from.language.iso);
//     //=> nl
// }).catch(err => {
//     console.error(err);
// });