/* 1st modules  */
const { readFileSync, readdirSync, symlink } = require('fs');
const path = require('path')
const { Boom } = require("@hapi/boom")
const { getDevice, DisconnectReason } = require('@adiwajshing/baileys');

const Whatsapp = require('../app/Whatsapp');
const { reply, sendAudio, sendVideo, sendDocument, sendText, sendMedia, sendTemplateButton, sendImage } = require('../lib/functions');
const { getMediaSession, resetMediaSession } = require('../utils/sessionMedia');
const { mess, menu, help, infoBot } = require('../lib/help');
const ModelDb = require('../models/index');
const db = new ModelDb();

const waBot = () => {
	const bot = new Whatsapp(path.join(__dirname, 'Auth_info.json'));
	bot.sock.ev.on('connection.update', async (update) => {
		const { connection, lastDisconnect, qr } = update
		if (connection === 'close') {
			const shouldReconnect = new Boom(lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut
			console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect)
			// reconnect if not logged out
			if (shouldReconnect) {
				const bott = waBot();
				return bott;
			} else {
				console.log('Silahkan Scan Ulang!');
				bot.logout(() => {
					process.exit(1);
				})
			}
		} else if (connection === 'open') {
			console.log('opened connection')
		}
	});

	bot.listenQR(qr => {
		// console.log(qr);
	})

	bot.listenMessage(async (receive) => {
		// console.log(receive);
		// Reading Command
		await readCommand(receive, bot);
	})

	bot.groupParticipantsUpdate(async (group) => {
		console.log(group);
		const welcome = await db.findOneGroup({ group_id: group.id }).then(res => res.welcome).catch(err => undefined);
		const left = await db.findOneGroup({ group_id: group.id }).then(res => res.left).catch(err => undefined);
		const text_welcome = await db.findOneGroup({ group_id: group.id }).then(res => res.text_welcome).catch(err => undefined);
		const text_left = await db.findOneGroup({ group_id: group.id }).then(res => res.text_left).catch(err => undefined);

		try {
			const { profilePictureUrl, groupMetadata } = bot.sock;
			const mData = await groupMetadata(group.id);
			if (group.action === 'add' && welcome) {
				const id_number = group.participants[0];
				const no_user = id_number.replace('@s.whatsapp.net', '');
				// Get foto profil user
				let ppUser = '';
				try {
					ppUser = await profilePictureUrl(id_number, 'image');
				} catch {
					ppUser = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
				}
				if (text_welcome != null) {
					await sendImage(mData.id, ppUser, { capt: text_welcome.replace('@user', '@' + no_user).replace('@groupname', mData.subject), mentions: [id_number] });
				} else {
					await sendImage(mData.id, ppUser, { capt: capt_welcome(id_number, mData.subject), mentions: [id_number] });
				}
			} else if (group.action === 'remove' && left) {
				const id_number = group.participants[0];
				const no_user = id_number.replace('@s.whatsapp.net', '');
				// Get foto profil user
				let ppUser = '';
				try {
					ppUser = await profilePictureUrl(id_number, 'image');
				} catch {
					ppUser = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
				}
				if (text_left != null) {
					await sendImage(mData.id, ppUser, { capt: text_left.replace('@user', '@' + no_user).replace('@groupname', mData.subject), mentions: [id_number] });
				} else {
					await sendImage(mData.id, ppUser, { capt: capt_left(id_number, mData.subject), mentions: [id_number] });
				}
			}
		} catch (err) {
			console.log(err);
		}
		// Caption Selamat Datang
		function capt_welcome(jid, name) {
			return `Halo @${jid.replace('@s.whatsapp.net', '')} 👋\nWelcome to the *Grup ${name}*
	
NewMem Tolong di Isi ya😊
*Intro GC 「${name}」:*

*>>Nama :*

*>>Usia :*

*>>Asal :*

*>>Gender :*

Salam Kenal👋

※JanganLupaBacaDeskripsi😊
※PatuhiPeraturanGC😊`
		}
		// Caption Out Group
		function capt_left(jid, name) {
			return `Selamat Tinggal @${jid.replace('@s.whatsapp.net', '')} di Grup ${name} 👋. Semoga Sehat selalu di sana`
		}
	})
	return bot;
}
waBot();

// bot.listenQR(qr => {
// 	// console.log(qr);
// })

// bot.listenMessage(async (receive) => {
// 	// console.log(receive);
// 	// Reading Command
// 	await readCommand(receive);
// })

// bot.groupParticipantsUpdate((value) => {
// 	console.log('Update Group');
// 	console.log(value);
// })


/**
 * 
 * @param {} receive Result Message yang udah di filter
 */
const readCommand = async (receive, bot) => {
	const { chat, from, isOwner, isGroupAdmin, command, prefix, args, isButtonResponseMessage, isTemplateButtonReplyMessage } = receive;
	const dir = readdirSync(path.join(__dirname, '../lib/command'));
	// Print log in terminal
	bot.printLog(receive);
	// Reading Button Response
	await buttonResponse(receive);
	// 
	if (isButtonResponseMessage) return;
	const arrayCommand = [];
	dir.forEach((value, i) => {
		// Command Category
		const cmd_category = readdirSync(path.join(__dirname, '../lib/command', value));
		cmd_category.forEach((value1, i) => {
			// Command Result
			const cmd_result = require(path.join(__dirname, '../lib/command', value, value1));
			if (cmd_result.command === undefined) return;
			// Command result per file
			cmd_result.command.forEach(async (v, i) => {
				// Filter command 
				arrayCommand.push(v);
				if (v === command) {
					if (cmd_result.isOwner && !isOwner) return bot.sock.sendMessage(from, { 'text': 'Khusus Owner gan' }, { quoted: chat })
					if (cmd_result.isGroupAdmin && !isGroupAdmin && !isOwner) return bot.sock.sendMessage(from, { 'text': 'Khusus Admin Group gan' }, { quoted: chat })
					await cmd_result.execute(receive, bot.sock);
					// Command help
				} else if (!isTemplateButtonReplyMessage && command === 'help' && args[0] === v) {
					await bot.sock.sendMessage(from, { text: String(cmd_result.description).replaceAll('prefix.', prefix) });
				}
			})
		})
	})
	if (command === null || args.length != 0) return;
	if (['help', 'menu', 'tos', 'donasi', 'groupbot'].some(v => v === command)) return await menu_help(receive);

	const unknownCmd = arrayCommand.some((v) => v === command);
	if (!unknownCmd) return await reply(from, 'Command tidak ada', chat);
}

/**
 * 
 * @param {} receive Result Message yang sudah di filter
 * @returns 
 */
const buttonResponse = async (receive) => {
	const { from, command, message, chat, user_id, isMedia } = receive;
	const mimetypeAudio = getDevice(from) == 'ios' ? 'audio/mpeg' : 'audio/mp4';
	const newCommand = command !== null ? command : String(message).toLocaleLowerCase();
	// Yt Download response
	if (!isMedia && newCommand === 'audio' && getMediaSession(user_id)) {
		await reply(from, mess.wait, chat)
		try {
			const resultMedia = getMediaSession(user_id)
			if (resultMedia.type !== 'ytdl') return;
			if (resultMedia.sizeMp3 >= 100) return reply(from, `Maaf file media terlalu besar, silahkan download lewat link di bawah ini\n\n Link: ${resultMedia.urlMp3}`, chat)
			resetMediaSession(user_id, 'ytdl')
			await sendAudio(from, resultMedia.urlMp3, { mimetype: mimetypeAudio })
		} catch (err) {
			console.error(err);
			sendText(from, mess.error.link)
		}
	} else if (!isMedia && newCommand === 'video' && getMediaSession(user_id)) {
		await reply(from, mess.wait, chat)
		try {
			const resultMedia = getMediaSession(user_id)
			if (resultMedia.sizeMp4 >= 100) return reply(from, `Maaf file media terlalu besar, silahkan download lewat link di bawah ini\n\n Link: ${resultMedia.urlMp4}`, chat)
			resetMediaSession(user_id, 'ytdl')
			await sendVideo(from, resultMedia.urlMp4);
		} catch (err) {
			console.error(err);
			sendText(from, mess.error.link)
		}
	} else if (!isMedia && newCommand === 'document' && getMediaSession(user_id)) {
		await reply(from, mess.wait, chat)
		try {
			const resultMedia = getMediaSession(user_id)
			resetMediaSession(user_id, 'ytdl')
			await sendDocument(from, resultMedia.urlMp3, { fileName: `${resultMedia.title}.mp3`, mimetype: 'audio/mpeg' })
		} catch (err) {
			console.error(err);
			sendText(from, mess.error.link)
		}
	}

	// Tiktok response
	if (!isMedia && newCommand === 'wm' && getMediaSession(user_id)) {
		await reply(from, mess.wait, chat);
		try {
			const resultMedia = await getMediaSession(user_id);
			resetMediaSession(user_id, 'tkt');
			await sendMedia(from, resultMedia.urlWm);
		} catch (err) {
			console.error(err);
			sendText(from, mess.error.link);
		}
	} else if (!isMedia && newCommand === 'nowm' && getMediaSession(user_id)) {
		await reply(from, mess.wait, chat);
		try {
			const resultMedia = await getMediaSession(user_id);
			resetMediaSession(user_id, 'tkt');
			await sendMedia(from, resultMedia.urlNowm);
		} catch (err) {
			console.error(err);
			sendText(from, mess.error.link);
		}
	} else if (!isMedia && newCommand === 'music' && getMediaSession(user_id)) {
		await reply(from, mess.wait, chat);
		try {
			const resultMedia = await getMediaSession(user_id);
			resetMediaSession(user_id, 'tkt');
			await sendAudio(from, resultMedia.urlMusic, { mimetype: mimetypeAudio });
		} catch (err) {
			console.error(err);
			sendText(from, mess.error.link);
		}
	}

	if (!isMedia && newCommand === 'audioquran' && getMediaSession(user_id)) {
		await reply(from, mess.wait, chat);
		try {
			const resultMedia = await getMediaSession(user_id);
			if (resultMedia.type !== 'ayah') return;
			resetMediaSession(user_id, 'ayah');
			await sendAudio(from, resultMedia.audio, { mimetype: mimetypeAudio });
		} catch (err) {
			sendText(from, mess.error.link);
			console.error(err);
		}
	} else if (!isMedia && newCommand === 'docquran' && getMediaSession(user_id)) {
		await reply(from, mess.wait, chat);
		try {
			const resultMedia = getMediaSession(user_id)
			resetMediaSession(user_id, 'quran')
			await sendDocument(from, resultMedia.audio, { fileName: `${resultMedia.title}.mp3`, mimetype: 'audio/mpeg' })
		} catch (err) {
			console.error(err);
			sendText(from, mess.error.link)
		}
	}

	if (!isMedia && newCommand === 'donasi') {
		const capt = `╔══✪〘 DONATE/DUKUNGAN 〙✪══
║
╠➥ *DONASI BISA MELALUI :*
╠➥ *DANA, OVO, GO-PAY : 081578794887*
╠➥ *SAWERIA : https://saweria.co/wahyuhp*
╠➥ *TERIMAKASIH YANG SUDAH BER DONASI, SEMOGA DILANCARKAN REZEKINYA*
╚═〘 YU BOT 〙`
		await sendText(from, capt);
	}
	if (!isMedia && newCommand === 'tos') {
		const caption_tos = `*INDONESIAN*
- Dilarang menelepon bot !!
- Mohon tidak menggunakan bot untuk melakukan tindakan ujaran kebencian dan sebagainya
- Bot tidak bertanggung jawab terhadap apa yang pengguna lakukan kepada bot

*ENGLISH*
- Don't call bot !!
- Please don't use bots to carry out hate speech acts and other
- Bots are not responsible for what users do to bots`
		await sendText(from, caption_tos);
	}
	if (!isMedia && newCommand === 'groupbot') {
		const capt = `*『 Group YU-BOT 』*\n 
Link Group : https://chat.whatsapp.com/KEdt4oziB2qBpdL4KKNvIu
*Silahkan gabung untuk mendapat informasi tentang Bot*`
		await sendText(from, capt);
	}
}

const menu_help = async (receive) => {
	const { from, command } = receive;
	const templateButtons_help = [
		{ index: 1, urlButton: { displayText: 'Jangan Lupa Follow', url: 'https://www.instagram.com/wahyuhp57/?hl=id' } },
		{ index: 2, quickReplyButton: { displayText: 'MENU', id: 'menu' } },
		{ index: 3, quickReplyButton: { displayText: 'DONASI', id: 'donasi' } },
		{ index: 4, quickReplyButton: { displayText: 'TERMS OF USE', id: 'tos' } },
		{ index: 5, quickReplyButton: { displayText: 'GROUP YU-BOT', id: 'groupbot' } },
	]
	const templateButtons_menu = [
		{ index: 1, urlButton: { displayText: 'Jangan Lupa Follow', url: 'https://www.instagram.com/wahyuhp57/?hl=id' } },
		{ index: 2, quickReplyButton: { displayText: 'HELP', id: 'help' } },
		{ index: 3, quickReplyButton: { displayText: 'DONASI', id: 'donasi' } },
		{ index: 4, quickReplyButton: { displayText: 'TERMS OF USE', id: 'tos' } },
		{ index: 5, quickReplyButton: { displayText: 'GROUP YU-BOT', id: 'groupbot' } },
	]
	if (command === 'help') return await sendTemplateButton(from, templateButtons_help, { text: await help(receive), footer: await infoBot(receive) });
	if (command === 'menu') return await sendTemplateButton(from, templateButtons_menu, { text: await menu(receive), footer: await infoBot(receive) });
}