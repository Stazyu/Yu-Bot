const { sendText, reply } = require("../../functions");
const { mess } = require("../../help");


module.exports = {
    name: "Keluar grup",
    command: ['leave', 'leavegc', 'join', 'joingc'],
    category: 'group',
    isAdminGroup: true,
    desc: '',
    async execute(msg, conn) {
        const { args, chat, command, isGroup, isOwner, from, prefix } = msg;
        if (['leave', 'leavegc'].some(v => v === command)) {
            try {
                if (!isGroup) return await reply(from, mess.info.onlyGroup, chat)
                await sendText(from, 'Bye-bye..');
                await conn.groupLeave(from);
            } catch (err) {
                await reply(from, mess.error.system)
                console.log(err);
            }
        } else if (['join', 'joingc'].some(v => v === command)) {
            if (args[0] === undefined) return await reply(from, `Format salah, silahkan ketik ${prefix}join <linkGroup>`)
            if (!isOwner) return await reply(from, 'Maaf fitur hanya bisa digunakan oleh Owner Bot!', chat);
            const linkWa = args[0];
            const regexWa = /(?:http(?:s|):\/\/|)chat.whatsapp.com\/([-_0-9A-Za-z]{10,25})/gi.exec(linkWa);
            const response = await conn.groupAcceptInvite(regexWa[1]);
            await sendText(from, "joined to: " + response);
            console.log("joined to: " + response);
        }
    }
}