const ModelDb = require('../../../models/index');
const { reply } = require('../../functions');
const bot = require('../../functions');
const db = new ModelDb();

module.exports = {
    name: 'Owner Command',
    command: ['selfbot', 'public', 'maintenance', 'chatread', 'eval', '>'],
    category: 'general (Owner)',
    isOwner: true,
    description: '',
    async execute(msg, conn) {
        const { args, command, chat, from, fromMe, message_prefix } = msg;
        switch (command) {
            case 'selfbot':
                if (args[0] === 'on') {
                    await db.updateSettingBot({ selfBot: true });
                    await reply(from, 'Fitur Self Bot telah dinyalakan..', chat);
                } else if (args[0] === 'off') {
                    await db.updateSettingBot({ selfBot: false });
                    await reply(from, 'Fitur Self Bot telah dimatikan..', chat);
                }
                break;
            case 'public':
                if (args[0] === 'on') {
                    await db.updateSettingBot({ public: true });
                    await reply(from, 'Penggunaan Bot telah di atur ke public..', chat);
                } else if (args[0] === 'off') {
                    await db.updateSettingBot({ public: false });
                    await reply(from, 'Penggunaan Bot telah di atur khusus owner..', chat);
                }
                break;
            case 'maintenance':
                if (args[0] === 'on') {
                    await db.updateSettingBot({ maintenance: true });
                    await reply(from, 'Maintenance Bot telah dinyalakan..', chat);
                } else if (args[0] === 'off') {
                    await db.updateSettingBot({ maintenance: false });
                    await reply(from, 'Maintenance Bot telah dimatikan..', chat);
                }
                break;
            case 'chatread':
                if (args[0] === 'on') {
                    await db.updateSettingBot({ chatRead: true });
                    await reply(from, 'Chat Read Bot telah dinyalakan..', chat);
                } else if (args[0] === 'off') {
                    await db.updateSettingBot({ chatRead: false });
                    await reply(from, 'Chat Read Bot telah dimatikan..', chat);
                }
                break;
            case 'eval':
            case '>':
                const input = command !== '>' ? message_prefix.slice(5) : message_prefix.slice(2);
                try {
                    let evaled = await eval(`(async() => {` + input + `})()`);
                    if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
                    reply(from, evaled, chat);
                } catch (e) {
                    reply(from, `${e}`, chat);
                }
                break;
            default:
                break;
        }
    }
}