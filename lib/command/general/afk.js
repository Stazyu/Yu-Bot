const { reply } = require("../../functions")
const { addAfkUser } = require("../../functions/afk")
const { mess } = require("../../help")
const { afkOnAlready, afkOn } = require("../../message/text/lang/ind")


module.exports = {
    name: 'Afk',
    command: ['afk'],
    category: 'Afk user',
    isOwner: false,
    description: '',
    async execute(msg, conn) {
        const { chat, far, from, isAfkOn, isGroup, pushName, user_id, date } = msg
        if (!isGroup) return await reply(from, mess.info.onlyGroup, chat);
        if (far == null) return await reply(from, `Format salah!, ketik ${prefix}afk <Alasan>\nContoh: ${prefix}afk Tidur`, chat);
        if (isAfkOn) return await reply(from, afkOnAlready(), chat);
        const reason = far;
        addAfkUser(user_id, date, reason);
        await reply(from, afkOn(pushName, reason), chat);
    }
}