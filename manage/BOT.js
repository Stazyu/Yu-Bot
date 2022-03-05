/* 1st modules  */
const { readFileSync, readdirSync } = require('fs');
const path = require('path')
const { Boom } = require("@hapi/boom")

const Whatsapp = require('../app/Whatsapp');
const { reply, sendAudio, sendVideo, sendDocument, sendText, sendMedia } = require('../lib/functions');
const { getMediaSession, resetMediaSession } = require('../utils/sessionMedia');
const { mess, menu } = require('../lib/help');
const { getDevice, DisconnectReason } = require('@adiwajshing/baileys');

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

	bot.groupParticipantsUpdate((value) => {
		console.log('Update Group');
		console.log(value);
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
	const { chat, from, isOwner, isGroupAdmin, command, prefix, args, isButtonResponseMessage } = receive;
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
				} else if (command === 'help' && args[0] === v) {
					await bot.sock.sendMessage(from, { text: String(cmd_result.description).replaceAll('prefix.', prefix) });
				}
			})
		})
	})
	if (command === null || command === 'help') return;
	if (command === 'menu') return await sendText(from, await menu(receive));

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
			if (resultMedia.sizeMp3 >= 100) return reply(from, `Maaf file media terlalu besar, silahkan download lewat link di bawah ini\n\n Link: ${resultMedia.urlMp3}`)
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
			if (resultMedia.sizeMp4 >= 100) return bot.reply(from, `Maaf file media terlalu besar, silahkan download lewat link di bawah ini\n\n Link: ${resultMedia.urlMp4}`)
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
}