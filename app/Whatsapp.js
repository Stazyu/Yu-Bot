// 1st Modules 
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');

// 2st Modules 
const axios = require('axios');
const { exec, spawn } = require('child_process');
// const moment = require('moment-timezone');
const ffmpeg = require('fluent-ffmpeg');

// Third Party Modules
const { default: WASocket, DisconnectReason, AnyMessageContent, delay, useSingleFileAuthState, getDevice, makeInMemoryStore } = require('@adiwajshing/baileys');
const QRCode = require('qrcode')
const P = require("pino")
const pretty = require('pino-pretty')
const { Boom } = require("@hapi/boom")
const moment = require('moment')
moment.locale('id')

const { connection } = require('../lib/functions');
const { color } = require('../utils/color');
const ModelDb = require('../models/index');
const db = new ModelDb();

// Save Message
const store = makeInMemoryStore({})
// can be read from a file
store.readFromFile('./baileys_store.json')
// saves the state to a file every 10s
setInterval(() => {
	store.writeToFile('./baileys_store.json')
}, 10_000)

class Whatsapp {
	/**
	 * 
	 * @param {String} SESSION_DATA Untuk menyimpan session 
	 * @param {Object} options {debug: boolean, bot_name: string, prefix: string, autoReconnect: string}
	 */
	constructor(SESSION_DATA, options = {}) {
		// Save Auth Multi Device
		const { state, saveState } = useSingleFileAuthState(SESSION_DATA);

		const sock = WASocket({
			logger: P({ level: 'info' }, pretty({ colorize: true })),
			version: [2, 2204, 13],
			printQRInTerminal: true,
			auth: state,
			// implement to handle retries
			// getMessage: async key => {
			// 	return {
			// 		conversation: 'hello'
			// 	}
			// }
		})
		store.bind(sock.ev)

		// sock.ev.on('connection.update', async (update) => {
		// 	const { connection, lastDisconnect, qr } = update
		// 	this.qr = qr;
		// 	if (connection === 'close') {
		// 		const shouldReconnect = new Boom(lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut
		// 		const reason = new Boom(lastDisconnect.error)?.output?.statusCode;
		// 		console.log('connection closed due to ', lastDisconnect.error.message, ', reconnecting ', shouldReconnect)
		// 		if (lastDisconnect.error.message === 'Stream Errored') {
		// 			this.logout(() => {
		// 				new Whatsapp(SESSION_DATA, options);
		// 			})
		// 		}
		// 		// else if (reason === DisconnectReason.restartRequired) {
		// 		// 	new Whatsapp(SESSION_DATA, options);
		// 		// } else if (reason === DisconnectReason.timedOut) {
		// 		// 	new Whatsapp(SESSION_DATA, options);
		// 		// } else if (reason === DisconnectReason.connectionClosed) {
		// 		// 	new Whatsapp(SESSION_DATA, options);
		// 		// } else if (reason === DisconnectReason.connectionLost) {
		// 		// 	new Whatsapp(SESSION_DATA, options);
		// 		// } else if (reason === DisconnectReason.connectionReplaced) {
		// 		// 	new Whatsapp(SESSION_DATA, options);
		// 		// } else if (reason === DisconnectReason.loggedOut) {
		// 		// 	this.logout(() => {
		// 		// 		new Whatsapp(SESSION_DATA, options);
		// 		// 	})
		// 		// }
		// 		if (shouldReconnect) {
		// 			new Whatsapp(SESSION_DATA, options);
		// 		}
		// 	} else if (connection === 'open') {
		// 		console.log('opened connection')
		// 	}
		// })
		sock.ev.on('creds.update', (auth) => {
			saveState();
		})
		connection(sock);

		this.sock = sock;
		this.SESSION_DATA = SESSION_DATA;
		this.owner = ['6281578794887', '6283104500832'];
		this.prefix = options.prefix ? options.prefix : '!';
		// this.date = moment().format('LLLL');
	}

	logout(onSuccess) {
		this.#deleteSession(() => {
			// this.sock.logout()
			onSuccess()
		})
	}

	// Delete Session saat disconnect dari wa nya
	async #deleteSession(onSuccess) {
		fs.unlink(this.SESSION_DATA, (err) => {
			if (err) {
				console.error(err);
				return;
			} else {
				console.log("Session file deleted!");
				onSuccess();
			}
		});
	}

	// Formatter number 0 to 62
	formatter(number, standard = "@c.us") {
		let formatted = number;
		// const standard = '@c.us'; // @s.whatsapp.net / @c.us
		if (!String(formatted).endsWith("@g.us")) {
			// isGroup ? next
			// 1. Menghilangkan karakter selain angka
			formatted = number.replace(/\D/g, "");
			// 2. Menghilangkan angka 62 di depan (prefix)
			//    Kemudian diganti dengan 0
			if (formatted.startsWith("0")) {
				formatted = "62" + formatted.slice(1);
			}
			// 3. Tambahkan standar pengiriman whatsapp
			if (!String(formatted).endsWith(standard)) {
				formatted += standard;
			}
		}
		return formatted;
	}

	getGroupAdmins(participans) {
		let admins = []
		participans.forEach((v, i) => {
			if (v.admin === 'admin') {
				admins.push(v);
			}
		})
		return admins
	}

	/**
	 * 
	 * @param {(url: String, err: Error)} value url QR dan error 
	 */
	async listenQR(value) {
		this.sock.ev.on('connection.update', ({ qr }) => {
			qr = qr !== undefined ? qr : null;
			setTimeout(() => {
				QRCode.toDataURL(qr, function (err, url) {
					value(url, err);
				})
			}, 5000);
		})
	}

	/**
	 * 
	 * @param {{id: String, participans: String[], action: ParticipantAction}} value Output Group Participants Update
	 */
	async groupParticipantsUpdate(value) {
		this.sock.ev.on('group-participants.update', (event) => {
			value(event);
		})
	}

	// Convert detik ke Hari, Jam, Menit, Detik
	secondsToDhms(seconds) {
		seconds = Number(seconds);
		let d = Math.floor(seconds / (3600 * 24));
		let h = Math.floor(seconds % (3600 * 24) / 3600);
		let m = Math.floor(seconds % 3600 / 60);
		let s = Math.floor(seconds % 60);

		let dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
		let hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
		let mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
		let sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
		return dDisplay + hDisplay + mDisplay + sDisplay;
	}

	/**
	 * 
	 * @param {} receive Message setelah di filter
	 */
	listenMessage(receive) {
		this.sock.ev.on('messages.upsert', async msg => {
			try {
				let chat = msg.messages[0];

				if (msg.type !== 'notify') return;
				if (chat.key.remoteJid === 'status@broadcast') return;
				/* ========== Meta Utama ========== */
				// if (chat.message.protocolMessage !== undefined)
				if (!chat.message || chat?.message?.senderKeyDistributionMessage || chat?.message?.protocolMessage) return;
				const chatMessage = chat.message;
				const id = chat.key.id;
				const from = chat.key.remoteJid;
				const fromMe = chat.key.fromMe;
				const participant = chat.key.participant;
				const isGroup = from.endsWith('@g.us');
				const content = JSON.stringify(chat.message);
				const type = Object.keys(chat.message).find((v, i) => v !== 'messageContextInfo');
				const messageTimestamp = chat.messageTimestamp;
				const totalChat = store.chats.all();
				const quotedInfo = type === 'extendedTextMessage' && chat.message.extendedTextMessage?.contextInfo?.quotedMessage !== null ? chat.message.extendedTextMessage.contextInfo : null;
				const quotedType = type === 'extendedTextMessage' && quotedInfo !== null ? Object.keys(quotedInfo.quotedMessage)[0] : null;
				const botNumber = String(this.sock.user.id).split(':')[0] + '@s.whatsapp.net';
				const mentionedJid = type === 'extendedTextMessage' && chat.message.extendedTextMessage?.contextInfo?.mentionedJid
				const prefix = this.prefix;
				const run = process.uptime();
				const runtime = this.secondsToDhms(run);
				const time = moment().format('HH:mm:ss');
				const date = moment().format('Do MMMM YYYY, h:mm:ss a');
				const setting = await db.findSettingBot().then(async (res) => {
					const sett = res !== null ?
						res :
						db.insertSettingBot({
							selfBot: false,
							public: true,
							maintenance: false,
							chatRead: false,
							type: "bot_setting",
							prefix: "#"
						})
					return sett;
				})

				/* ============ Meta User & Owner ============ */
				const user_idd = isGroup ? chat.key.participant : chat.key.remoteJid;
				const user_id = /([0-9]{12,14})/gi.exec(user_idd)[0] + '@s.whatsapp.net';
				const pushName = chat.pushName;
				const ownerNumber = this.owner.map((nomor, i) => {
					return this.formatter(nomor, "@s.whatsapp.net");
				})
				const isOwner = ownerNumber.includes(user_id) || false

				/* ============ Meta Group ============= */
				const groupMetadata = isGroup ? await this.sock.groupMetadata(from) : null;
				const groupName = isGroup ? groupMetadata.subject : null;
				const groupId = isGroup ? groupMetadata.id : null;
				const groupMembers = isGroup ? groupMetadata.participants : null;
				const groupDesc = isGroup ? groupMetadata.desc.toString() : null;
				const groupAdmins = isGroup ? this.getGroupAdmins(groupMembers).map(v => {
					return v.id;
				}) : [];
				const isBotGroupAdmin = groupAdmins.includes(botNumber);
				const isGroupAdmin = groupAdmins.includes(user_id);

				if (setting.chatRead) {
					await this.sock.sendReceipt(from, participant, [id], 'read');
				}

				/* ========== Message type ========== */
				// const { audio, buttonsMessage, contact, contactsArray, document, extendedText, groupInviteMessage, image, listMessage, liveLocation, location, product, sticker, text, video } = MessageType
				const isMedia = (type === 'imageMessage' || type === 'videoMessage' || type === 'audioMessage' || type === 'stickerMessage')
				const isAudio = type === 'audioMessage'
				const isImage = type === 'imageMessage'
				const isVideo = type === 'videoMessage'
				const isSticker = type === 'stickerMessage'
				const isDocument = type === "documentMessage"
				const isButtonMessage = type === 'buttonsMessage'
				const isButtonResponseMessage = type === 'buttonsResponseMessage'
				const isTemplateButtonReplyMessage = type === 'templateButtonReplyMessage'
				const isQuotedAudio = type === 'extendedTextMessage' && content.includes('audioMessage')
				const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
				const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
				const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
				const isQuotedDocument = type === 'extendedTextMessage' && content.includes('documentMessage')
				const isQuotedMedia = isQuotedAudio || isQuotedImage || isQuotedVideo || isQuotedSticker || isQuotedDocument

				const message_prefix = type === 'conversation' && chat.message.conversation.startsWith(this.prefix) ?
					chat.message.conversation : type === 'imageMessage' && chat.message.imageMessage.caption !== null && chat.message.imageMessage.caption.startsWith(this.prefix) ?
						chat.message.imageMessage.caption : type === 'videoMessage' && chat.message.videoMessage.caption !== null && chat.message.videoMessage.caption.startsWith(this.prefix) ?
							chat.message.videoMessage.caption : type === 'extendedTextMessage' && chat.message.extendedTextMessage.text.startsWith(this.prefix) ?
								chat.message.extendedTextMessage.text : null;
				const message_button = type === 'buttonsResponseMessage' ?
					chat.message.buttonsResponseMessage.selectedButtonId : type === 'templateMessage' ?
						chat.message.templateMessage.hydratedTemplate.quickReplyButton.id : type === 'templateButtonReplyMessage' ?
							chat.message.templateButtonReplyMessage.selectedId : type === 'listResponseMessage' ?
								chat.message.listResponseMessage.singleSelectReply.selectedRowId : null;
				let message = type === 'conversation' ?
					chat.message.conversation : type === 'extendedTextMessage' ?
						chat.message.extendedTextMessage.text : type === 'imageMessage' ?
							chat.message.imageMessage.caption : type === 'videoMessage' ?
								chat.message.videoMessage.caption : null;
				message = String(message).startsWith(this.prefix) ? null : message

				/* Message Command */
				const command = message_button !== null
					? message_button.toLowerCase()
					: message_prefix !== null
						? String(message_prefix).slice(1).trim().split(/ +/).shift().toLowerCase()
						: null;
				const args = message && typeof message !== "object"
					? message.trim().split(/ +/).slice(1)
					: message_prefix !== null ? message_prefix.trim().split(/ +/).slice(1) : [];
				const far = args !== null ? args.join(" ") : null;
				const isCmd = message && typeof message !== "object"
					? message.startsWith(this.prefix)
					: message_prefix !== null ? message_prefix.startsWith(this.prefix) : false;

				/* Ucapan Waktu */
				let ucapanWaktu = ''
				if (time <= "03:30:00") {
					ucapanWaktu = 'Selamat Malam'
				} else if (time <= "11:00:00") {
					ucapanWaktu = 'Selamat Pagi'
				} else if (time <= "15:00:00") {
					ucapanWaktu = "Selamat Siang"
				} else if (time <= "18:00:00") {
					ucapanWaktu = "Selamat Sore"
				} else if (time <= "20:00:00") {
					ucapanWaktu = "Selamat Petang"
				} else if (time <= "23:59:00") {
					ucapanWaktu = "Selamat Malam"
				}


				// Setting Self-Bot
				if (fromMe && !setting.selfBot && command) return;
				// Setting Public Bot
				if (!isOwner && !fromMe && !setting.public && command) return;
				// Setting Maintenance Bot
				if (!isOwner && !fromMe && setting.maintenance && command) {
					return this.sock.sendMessage(from, { text: 'Mohon Maaf.. Saat ini bot sedang dalam Pemeliharaan/Maintenance🛠️' })
				}

				// Auto Verify
				const isVerify = isGroup ?
					await db.findOneGroup({ group_id: groupId }).then(v => v.group_id === groupId).catch(err => undefined) :
					await db.findOneUser({ user_id }).then(v => v.user_id === user_id).catch(err => undefined);
				if (!isVerify && isGroup && isCmd) {
					let ppWa = null;
					try {
						ppWa = await this.sock.profilePictureUrl(from, 'image');
					} catch {
						ppWa = null;
					}
					await db.insertOneGroup({
						group_id: groupId,
						group_name: groupName,
						urlpp: ppWa,
						join_time: Date.now(),
						verify: true
					}).then(v => console.log(color(`[VERIFY || AUTO]`, 'green'), color('=>', 'white'), color(`DATE: ${date}`, 'yellow'), color(groupName, 'green'), color('FROM', 'white'), color(groupName, 'yellow')));
				} else if (!isVerify && !isGroup && isCmd) {
					let ppWa = null;
					try {
						ppWa = await this.sock.profilePictureUrl(from, 'image');
					} catch {
						ppWa = null;
					}
					await db.insertOneUser({
						user_id: user_id,
						user_name: pushName,
						urlpp: ppWa,
						limit: 40,
						join_time: Date.now(),
						verify: true
					}).then(v => console.log(color(`[VERIFY || AUTO]`, 'green'), color('=>', 'white'), color(`DATE: ${date}`, 'yellow'), color('=>', 'white'), color('NAME', 'white'), color(pushName, 'green'), color('FROM', 'white'), color(String(user_id).split('@')[0], 'yellow')));
				}

				receive({
					chat,
					chatMessage,
					quotedInfo,
					isGroup,
					isOwner,
					from,
					user_idd,
					user_id,
					mentionedJid,
					botNumber,
					runtime,
					pushName,
					message_prefix,
					message,
					content,
					type,
					totalChat,
					quotedType,
					prefix,
					isMedia,
					isImage,
					isAudio,
					isVideo,
					isSticker,
					isDocument,
					isButtonMessage,
					isButtonResponseMessage,
					isTemplateButtonReplyMessage,
					isQuotedAudio,
					isQuotedImage,
					isQuotedVideo,
					isQuotedSticker,
					isQuotedDocument,
					isQuotedMedia,
					// body,
					// messagesLink,
					command,
					args,
					far,
					isCmd,
					ownerNumber,
					// grup
					groupMetadata,
					groupName,
					groupId,
					groupMembers,
					groupDesc,
					groupAdmins,
					isBotGroupAdmin,
					isGroupAdmin,
					// 
					ucapanWaktu,
					time,
					date
				})
			} catch (err) {
				console.log(err);
			}
		})
	}
	printLog(msg) {
		const { date, isCmd, message, command, groupName, isGroup, isMedia, isTemplateButtonReplyMessage, isButtonResponseMessage, isDocument, isAudio, isSticker, user_id } = msg
		if (!isCmd && isGroup && !isMedia && !isSticker && !command) console.log(color(`[GROUP || MSG]`, 'blue'), color('=>', 'white'), color(`DATE: ${date}`, 'yellow'), color(message, 'blue'), color('FROM', 'white'), color(String(user_id).split('@')[0], 'yellow'), color('IN', 'white'), color(groupName, 'yellow'));
		if (!isCmd && !isGroup && !isMedia && !isSticker && !command) console.log(color(`[PRIVATE || MSG]`, 'blue'), color('=>', 'white'), color(`DATE: ${date}`, 'yellow'), color(message, 'blue'), color('FROM', 'white'), color(String(user_id).split('@')[0], 'yellow'));
		if (isCmd && isGroup && !isMedia && !isSticker) console.log(color(`[GROUP || CMD]`), color('=>', 'white'), color(`DATE: ${date}`, 'yellow'), color(this.prefix + command), color('FROM', 'white'), color(String(user_id).split('@')[0], 'yellow'), color('IN', 'white'), color(groupName, 'yellow'));
		if (isCmd && !isGroup && !isMedia && !isSticker) console.log(color(`[PRIVATE || CMD]`), color('=>', 'white'), color(`DATE: ${date}`, 'yellow'), color(this.prefix + command), color('FROM', 'white'), color(String(user_id).split('@')[0], 'yellow'));
		if (isGroup && !isMedia && !isSticker && isTemplateButtonReplyMessage || isButtonResponseMessage) console.log(color(`[GROUP || BUTTON]`), color('=>', 'white'), color(`DATE: ${date}`, 'yellow'), color(command), color('FROM', 'white'), color(String(user_id).split('@')[0], 'yellow'), color('IN', 'white'), color(groupName, 'yellow'));
		if (!isGroup && !isMedia && !isSticker && isTemplateButtonReplyMessage || isButtonResponseMessage) console.log(color(`[PRIVATE || BUTTON]`), color('=>', 'white'), color(`DATE: ${date}`, 'yellow'), color(command), color('FROM', 'white'), color(String(user_id).split('@')[0], 'yellow'));
	}
}

// process.on('uncaughtException', (err, origin) => {
// 	console.error(err);
// 	console.error(origin);
// })

module.exports = Whatsapp