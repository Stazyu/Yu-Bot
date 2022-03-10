const { sendText, reply } = require("../../functions");


module.exports = {
    name: "Broadcast/Pesan siaran ke semua member atau group",
    command: ['bc', 'broadcast'],
    category: 'general',
    isOwner: true,
    description: '',
    async execute(msg, conn) {
        const { args, chat, from, prefix, totalChat } = msg;
        if (args[0] === undefined) return reply(from, `*Format salah!*\n\nFormat: ${prefix}bc grup/kontak/all <caption teks broadcast\nContoh: ${prefix}bc grup Halo gaess`, chat)
        const teksBC = args.join(' ').slice(args[0].length + 1)
        const captBC = `*『 BOT BROADCAST 』*\n\n${teksBC}`
        let totalBCGroup = [];
        let totalBCKontak = [];
        if (args[0] === 'grup') {
            for (let i = 0; i < totalChat.length; i++) {
                if (totalChat[i].id.includes('@g.us') && !totalChat[i].id.includes('@broadcast')) {
                    totalBCGroup.push(totalChat[i].id);
                    sleep(500);
                    sendText(totalChat[i].id, captBC);
                }
            }
            reply(from, `Sukses BC ke ${totalBCGroup.length} Group!`, chat)
        } else if (args[0] === 'kontak') {
            for (let i = 0; i < totalChat.length; i++) {
                if (totalChat[i].id.includes('@s.whatsapp.net') && !totalChat[i].id.includes('@broadcast')) {
                    totalBCKontak.push(totalChat[i].id);
                    sleep(500);
                    sendText(totalChat[i].id, captBC);
                }
            }
            reply(from, `Sukses BC ke ${totalBCKontak.length} Kontak!`, chat)
        } else if (args[0] === 'all') {
            console.log(totalChat);
            for (let i = 0; i < totalChat.length; i++) {
                if (totalChat[i].id.includes('@g.us')) totalBCGroup.push(totalChat[i].id);
                if (totalChat[i].id.includes('@s.whatsapp.net')) totalBCKontak.push(totalChat[i].id);
                sleep(500);
                sendText(totalChat[i].id, captBC);
            }
            reply(from, `Sukses BC ke ${totalBCKontak.length} Kontak dan ${totalBCGroup.length} Group!`, chat);
        } else {
            reply(from, `Format salah!\n\nFormat: ${prefix}bc grup/kontak/all <caption teks broadcast>\nContoh: ${prefix}bc grup Halo gaess`, chat)
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