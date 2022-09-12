const { sendText, reply } = require("../../functions");
const Db = require("../../../models/index");

const db = new Db();

module.exports = {
    name: "Broadcast/Pesan siaran",
    command: ['bc', 'broadcast'],
    category: 'general',
    isOwner: true,
    description: 'Broadcast atau Pesan siaran adalah mengirim pesan ke semua Grup, Kontak maupun Grup dan Kontak\n\nFormat: prefix.bc grup/kontak/all <caption teks broadcast>\nContoh: prefix.bc grup Halo gaess',
    async execute(msg, conn) {
        const { args, chat, from, prefix } = msg;
        const totalChat = await db.findAllUser()
        if (args[0] === undefined) return reply(from, `*Format salah!*\n\nFormat: ${prefix}bc grup/kontak/all <caption teks broadcast>\nContoh: ${prefix}bc grup Halo gaess`, chat)
        const teksBC = args.join(' ').slice(args[0].length + 1)
        const captBC = `*『 BOT BROADCAST 』*\n\n${teksBC}`
        let totalBCGroup = [];
        let totalBCKontak = [];
        try {
            if (args[0] === 'grup') {
                for (let i = 0; i < totalChat.length; i++) {
                    if (totalChat[i].user_id.includes('@g.us') && !totalChat[i].user_id.includes('@broadcast')) {
                        totalBCGroup.push(totalChat[i].user_id);
                        await sleep(1000);
                        await sendText(totalChat[i].user_id, captBC);
                    }
                }
                reply(from, `Sukses BC ke ${totalBCGroup.length} Group!`, chat)
            } else if (args[0] === 'kontak') {
                console.log(totalChat);
                for (let i = 0; i < totalChat.length; i++) {
                    if (totalChat[i].user_id.includes('@s.whatsapp.net') && !totalChat[i].user_id.includes('@broadcast')) {
                        totalBCKontak.push(totalChat[i].user_id);
                        await sleep(1000);
                        await sendText(totalChat[i].user_id, captBC);
                    }
                }
                reply(from, `Sukses BC ke ${totalBCKontak.length} Kontak!`, chat)
            } else if (args[0] === 'all') {
                console.log(totalChat);
                for (let i = 0; i < totalChat.length; i++) {
                    if (totalChat[i].user_id.includes('@g.us')) totalBCGroup.push(totalChat[i].user_id);
                    if (totalChat[i].user_id.includes('@s.whatsapp.net')) totalBCKontak.push(totalChat[i].user_id);
                    await sleep(1000);
                    await sendText(totalChat[i].user_id, captBC);
                }
                reply(from, `Sukses BC ke ${totalBCKontak.length} Kontak dan ${totalBCGroup.length} Group!`, chat);
            } else {
                reply(from, `Format salah!\n\nFormat: ${prefix}bc grup/kontak/all <caption teks broadcast>\nContoh: ${prefix}bc grup Halo gaess`, chat)
            }
        } catch (err) {
            console.log(err);
        }
    }
}

function sleep(delayInms) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(2);
        }, delayInms);
    });
}