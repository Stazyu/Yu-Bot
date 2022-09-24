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
        const { args, chat, from, prefix, totalChat } = msg;
        const totalChatDb = await db.findAllUser()
        const all = args.join(' ');
        const dbChat = all.split(' | ')[0];
        const typeBC = all.split(' | ')[1].split(' ')[0];
        if (!dbChat || !typeBC) return reply(from, `*Format salah!*\n\nFormat: ${prefix}bc store/database | grup/kontak/all <caption teks broadcast>\nContoh: ${prefix}bc store | grup Halo gaess`, chat)
        const teksBC = args.join(' ').slice(dbChat.length + typeBC.length + 4);
        const captBC = `*『 BOT BROADCAST 』*\n\n${teksBC}`
        let totalBCGroup = [];
        let totalBCKontak = [];
        try {
            if (typeBC === 'grup') {
                if (dbChat === 'database') {
                    await reply(from, 'Khusus Group hanya bisa lewat store', chat)
                } else if (dbChat === 'store') {
                    for (let i = 0; i < totalChat.length; i++) {
                        if (totalChat[i].id.includes('@g.us') && !totalChat[i].id.includes('@broadcast')) {
                            totalBCGroup.push(totalChat[i].id);
                            await sleep(1000);
                            await sendText(totalChat[i].id, captBC);
                        }
                    }
                }
                await reply(from, `Sukses BC ke ${totalBCGroup.length} Group!`, chat)
            } else if (typeBC === 'kontak') {
                if (dbChat === 'database') {
                    console.log(totalChatDb);
                    for (let i = 0; i < totalChatDb.length; i++) {
                        if (totalChatDb[i].user_id.includes('@s.whatsapp.net') && !totalChatDb[i].user_id.includes('@broadcast')) {
                            totalBCKontak.push(totalChatDb[i].user_id);
                            await sleep(1000);
                            await sendText(totalChatDb[i].user_id, captBC);
                        }
                    }
                } else if (dbChat === 'store') {
                    console.log(totalChat);
                    for (let i = 0; i < totalChat.length; i++) {
                        if (totalChat[i].id.includes('@s.whatsapp.net') && !totalChat[i].id.includes('@broadcast')) {
                            totalBCKontak.push(totalChat[i].id);
                            await sleep(1000);
                            await sendText(totalChat[i].id, captBC);
                        }
                    }
                }
                reply(from, `Sukses BC ke ${totalBCKontak.length} Kontak!`, chat)
            } else if (typeBC === 'all') {
                if (dbChat === 'database') {
                    console.log(totalChatDb);
                    for (let i = 0; i < totalChatDb.length; i++) {
                        if (totalChatDb[i].user_id.includes('@g.us')) totalBCGroup.push(totalChatDb[i].user_id);
                        if (totalChatDb[i].user_id.includes('@s.whatsapp.net')) totalBCKontak.push(totalChatDb[i].user_id);
                        await sleep(1000);
                        await sendText(totalChatDb[i].user_id, captBC);
                    }
                } else if (dbChat === 'store') {
                    console.log(totalChat);
                    for (let i = 0; i < totalChat.length; i++) {
                        if (totalChat[i].id.includes('@g.us')) totalBCGroup.push(totalChat[i].id);
                        if (totalChat[i].id.includes('@s.whatsapp.net')) totalBCKontak.push(totalChat[i].id);
                        await sleep(1000);
                        await sendText(totalChat[i].id, captBC);
                    }
                }
                reply(from, `Sukses BC ke ${totalBCKontak.length} Kontak dan ${totalBCGroup.length} Group!`, chat);
            } else {
                reply(from, `Format salah!\n\nFormat: ${prefix}bc store/database | grup/kontak/all <caption teks broadcast>\nContoh: ${prefix}bc store | grup Halo gaess`, chat)
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