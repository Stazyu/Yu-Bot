const ModelDb = require('../../../models/index');
const { reply, sendText } = require('../../functions');
const { mess } = require('../../help');
const db = new ModelDb();

module.exports = {
    name: 'Welcome, left & Welcome text, Left text',
    command: ['welcome', 'left', 'welcometext', 'lefttext'],
    category: 'Group',
    isAdminGroup: true,
    description: `➾ prefix.welcome [Sapaan saat ada member masuk]
    - Format : prefix.welcome <on atau off>
    - Contoh : prefix.welcome on

➾ prefix.welcometext [Untuk mengatur text sapaan member masuk]
    - Format 1 : prefix.welcometext set captionnya tag user @user, nama grup @groupname
    - Format 2 : prefix.welcometext default
    - Contoh : prefix.welcometext set Selamat datang @user di grup @groupname

➾ prefix.left [Sapaann member keluar]
    - Format : prefix.welcome <on atau off>
    - Contoh : prefix.welcome on

➾ prefix.lefttext [Untuk mengatur text sapaan member keluar]
    - Format 1 : prefix.lefttext set captionnya tag user @user, nama grup @groupname
    - Format 2 : prefix.lefttext default
    - Contoh : prefix.lefttext set Selamat Jalan @user di grup @groupname `,
    async execute(msg, conn) {
        const { args, chat, command, fromMe, groupId, groupName, from, isGroupAdmins, isGroup, isOwner, prefix } = msg;
        if (!isGroup) return await reply(from, mess.info.onlyGroup, chat);
        switch (command) {
            case 'welcome':
                if (!fromMe && !isGroupAdmins && !isOwner) return reply(from, 'Mohon Maaf.. Fitur ini khusus Admin Grup!', chat);
                if (args[0] === undefined) return await reply(from, `Format Salah!\n\nFormat : ${prefix}welcome [on atau off]\nContoh : ${prefix}welcome on`);
                if (args[0] === 'on') {
                    const groupEdit = await db.updateOneGroup({ group_id: groupId }, {
                        welcome: true,
                    })
                    console.log(groupEdit);
                    await sendText(from, `Welcome di group ${groupName} telah di aktifkan!`);
                } else if (args[0] === 'off') {
                    const groupEdit = await db.updateOneGroup({ group_id: groupId }, {
                        welcome: false,
                    })
                    console.log(groupEdit);
                    await sendText(from, `Welcome di group ${groupName} telah di matikan!`);
                } else {
                    await reply(from, `Format Salah!\n\nFormat : ${prefix}welcome [on atau off]\nContoh : ${prefix}welcome on`);
                }
                break
            case 'welcometext':
                if (!fromMe && !isGroupAdmins && !isOwner) return await reply(from, 'Mohon Maaf.. Fitur ini khusus Admin Grup!', chat);
                if (args[0] === undefined || args.join(' ').slice(args[0].length + 1) === '' && args[0] !== 'default') return await reply(from, `*Format salah!*\n\nFormat : ${prefix}welcometext set captionnya tag user @user, nama grup @groupname\nContoh : ${prefix}welcometext set Selamat datang @user di grup @groupname `)
                const textWel = args.join(' ').slice(args[0].length + 1)
                if (args[0] === 'set') {
                    const groupEdit = await db.updateOneGroup({ group_id: groupId }, {
                        text_welcome: textWel,
                    })
                    console.log(groupEdit);
                    await sendText(from, `Text Welcome di group ${groupName} berhasil di ganti!`);
                } else if (args[0] === 'default') {
                    const groupEdit = await db.updateOneGroup({ group_id: groupId }, {
                        text_welcome: null,
                    })
                    console.log(groupEdit);
                    await sendText(from, `Text Welcome di group ${groupName} berhasil di ganti ke default!`);
                } else {
                    await reply(from, `*Format salah!*\n\nFormat : ${prefix}welcometext set captionnya tag user @user, nama grup @groupname\nContoh : ${prefix}welcometext set Selamat datang @user di grup @groupname `)
                }
                break
            case 'left':
                if (!fromMe && !isGroupAdmins && !isOwner) return await reply(from, 'Mohon Maaf.. Fitur ini khusus Admin Grup!', chat);
                if (args[0] === undefined) return await reply(from, `Format Salah!\n\nFormat : ${prefix}left [on atau off]\nContoh : ${prefix}left on`);
                if (args[0] === 'on') {
                    const groupEdit = await db.updateOneGroup({ group_id: groupId }, {
                        left: true,
                    })
                    console.log(groupEdit);
                    await sendText(from, `Welcome di group ${groupName} telah di aktifkan!`);
                } else if (args[0] === 'off') {
                    const groupEdit = await db.updateOneGroup({ group_id: groupId }, {
                        left: false,
                    })
                    console.log(groupEdit);
                    await sendText(from, `Welcome di group ${groupName} telah di matikan!`);
                } else {
                    await reply(from, `Format Salah!\n\nFormat : ${prefix}left [on atau off]\nContoh : ${prefix}left on`);
                }
                break
            case 'lefttext':
                if (!fromMe && !isGroupAdmins && !isOwner) return await reply(from, 'Mohon Maaf.. Fitur ini khusus Admin Grup!', chat);
                if (args[0] === undefined || args.join(' ').slice(args[0].length + 1) === '' && args[0] !== 'default') return await reply(from, `*Format salah!*\n\nFormat : ${prefix}lefttext set captionnya tag user @user, nama grup @groupname\nContoh : ${prefix}lefttext set Selamat datang @user di grup @groupname `)
                const textLeft = args.join(' ').slice(args[0].length + 1)
                if (args[0] === 'set') {
                    await db.updateOneGroup({ group_id: groupId }, {
                        text_left: textLeft,
                    })
                    await sendText(from, `Sapaan orang keluar di group ${groupName} berhasil di ganti!`);
                } else if (args[0] === 'default') {
                    await db.updateOneGroup({ group_id: groupId }, {
                        text_left: null,
                    })
                    await sendText(from, `Sapaan orang keluar di group ${groupName} berhasil di ganti ke default!`);
                } else {
                    await reply(from, `*Format salah!*\n\nFormat : ${prefix}lefttext set captionnya tag user @user, nama grup @groupname\nContoh : ${prefix}lefttext set Selamat Jalan @user di grup @groupname `)
                }
                break
            default:
                break;
        }
    }
}