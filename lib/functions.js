const path = require('path');
const { default: WASocket, downloadContentFromMessage, prepareWAMessageMedia, generateWAMessageFromContent, proto } = require('@adiwajshing/baileys');
const axios = require('axios').default;
const { writeFile, readFile, readFileSync, writeFileSync } = require('fs');
const { fromBuffer } = require('file-type');
const { randomString } = require('../helpers/generate');
const { pngToWebpFromUrl, pngToWebpFromBuffer } = require('../utils/convert');

let wa;

/**
 * 
 * @param {WASocket} sock 
 */
const connection = (sock) => {
	wa = sock;
}

/**
 * 
 * @param {String} url 
 * @param {{}} options 
 * @returns
 */
const getBuffer = async (url, options) => {
	try {
		options ? options : {}
		const res = await axios({
			method: "get",
			url,
			headers: {
				'DNT': 1,
				'Upgrade-Insecure-Request': 1
			},
			...options,
			responseType: 'arraybuffer'
		})
		return res.data
	} catch (e) {
		console.log(`Error : ${e}`)
	}
}

/**
 * 
 * @param {{}} msg WAMessage
 * @param {String} ext Extenseion (example: .mp3, .mp4, .png)
 * @returns 
 * @example 
 * const {path, buffer} = downloadMediaWa(msg, '.png')
 * console.log(path, buffer)
 */
const downloadMediaWa = async (msg, ext = '', nameFile = '') => {
	const { chatMessage, isQuotedMedia, quotedInfo } = msg;
	const mediaMessage = isQuotedMedia ? quotedInfo.quotedMessage : chatMessage;
	const messageType = Object.keys(mediaMessage)[0];
	const randomStr = nameFile !== '' ? nameFile : randomString(4);
	if (messageType === 'imageMessage') {
		const mediaInfo = mediaMessage.imageMessage;
		const stream = await downloadContentFromMessage(mediaInfo, 'image');
		let buffer = Buffer.from([]);
		for await (const chunk of stream) {
			buffer = Buffer.concat([buffer, chunk])
		}

		writeFileSync(path.join(__dirname, '../temp', `${randomStr}${ext}`), buffer);
		return { path: path.join(__dirname, '../temp', `${randomStr}${ext}`), buffer: readFileSync(path.join(__dirname, '../temp', `${randomStr}${ext}`)) }
	} else if (messageType === 'videoMessage') {
		const mediaInfo = mediaMessage.videoMessage;
		const stream = await downloadContentFromMessage(mediaInfo, 'video');
		let buffer = Buffer.from([]);
		for await (const chunk of stream) {
			buffer = Buffer.concat([buffer, chunk])
		}

		writeFileSync(path.join(__dirname, '../temp', `${randomStr}${ext}`), buffer);
		return { path: path.join(__dirname, '../temp', `${randomStr}${ext}`), buffer: readFileSync(path.join(__dirname, '../temp', `${randomStr}${ext}`)) };
	} else if (messageType === 'audioMessage') {
		const mediaInfo = mediaMessage.audioMessage;
		const stream = await downloadContentFromMessage(mediaInfo, 'audio');
		let buffer = Buffer.from([]);
		for await (const chunk of stream) {
			buffer = Buffer.concat([buffer, chunk])
		}

		writeFileSync(path.join(__dirname, '../temp', `${randomStr}${ext}`), buffer);
		return { path: path.join(__dirname, '../temp', `${randomStr}${ext}`), buffer: readFileSync(path.join(__dirname, '../temp', `${randomStr}${ext}`)) };
	} else if (messageType === 'stickerMessage') {
		const mediaInfo = mediaMessage.stickerMessage;
		const stream = await downloadContentFromMessage(mediaInfo, 'sticker');
		let buffer = Buffer.from([]);
		for await (const chunk of stream) {
			buffer = Buffer.concat([buffer, chunk])
		}

		writeFileSync(path.join(__dirname, '../temp', `${randomStr}${ext}`), buffer);
		return { path: path.join(__dirname, '../temp', `${randomStr}${ext}`), buffer: readFileSync(path.join(__dirname, '../temp', `${randomStr}${ext}`)) };
	} else if (messageType === 'documentMessage') {
		const mediaInfo = mediaMessage.documentMessage;
		const stream = await downloadContentFromMessage(mediaInfo, 'document');
		let buffer = Buffer.from([]);
		for await (const chunk of stream) {
			buffer = Buffer.concat([buffer, chunk])
		}

		writeFileSync(path.join(__dirname, '../temp', `${randomStr}${ext}`), buffer);
		return { path: path.join(__dirname, '../temp', `${randomStr}${ext}`), buffer: readFileSync(path.join(__dirname, '../temp', `${randomStr}${ext}`)) };
	}
}

/**
 * 
 * @param {String} from groupId atau user_id
 * @param {String | Buffer} buff  text teks yang akan dikirim
 * @param {{mentions?: String[]}} options Options Message
 * @returns 
 */
const sendText = async (from, text, options = {}) => {
	const msg_result = await wa.sendMessage(from, { text, linkPreview: null, mentions: options.mentions });
	return msg_result;
}

/**
 * 
 * @param {String} from groupId atau user_id
 * @param {String} text  text teks yang akan dikirim
 * @param {String} msg WAMessage
 * @param {{mentions?: String[]}} options Options Message 
 * @returns 
 */
const reply = async (from, text, msg, options = {}) => {
	const msg_result = await wa.sendMessage(from, { text: text, linkPreview: null, mentions: options.mentions }, { quoted: msg });
	return msg_result;
}

/**
 * 
 * @param {String} from groupId atau user_id
 * @param {URL | Buffer} buff  buff Url atau Buffer
 * @param {{capt?: String, jpegThumbnail?: String, msg: String, mentions: String[]}} options Options Message => {caption: teks, jpegThumbnail: url, msg: WAMessage} 
 * @returns 
 */
const sendImage = async (from, buff, options = {}) => {
	if (typeof buff === 'string') {
		const msg_result = await wa.sendMessage(from, { caption: options.capt, image: { url: buff }, jpegThumbnail: options.jpegThumbnail, mentions: options.mentions }, { quoted: options.msg });
		return msg_result;
	} else {
		const msg_result = await wa.sendMessage(from, { caption: options.capt, image: buff, jpegThumbnail: options.jpegThumbnail, mentions: options.mentions }, { quoted: options.msg });
		return msg_result;
	}
}

/**
 * 
 * @param {String} from groupId atau user_id
 * @param {URL | Buffer} buff  buff Url atau Buffer
 * @param {{ptt?: Boolean, msg?: String, mimetype?: String, mentions: String[]}} options Options Message => {ptt: Boolean, msg: WAMessage}
 * @returns 
 */
const sendAudio = async (from, buff, options = {}) => {
	if (typeof buff === 'string') {
		const msg_result = await wa.sendMessage(from, { audio: { url: buff }, ptt: options.ptt, mimetype: options.mimetype, mentions: options.mentions }, { quoted: options.msg });
		return msg_result;
	} else {
		const msg_result = await wa.sendMessage(from, { audio: buff, ptt: options.ptt, mimetype: options.mimetype, mentions: options.mentions }, { quoted: options.msg });
		return msg_result;
	}
}

/**
 * 
 * @param {String} from groupId atau user_id
 * @param {URL | Buffer} buff  Url atau Buffer
 * @param {{caption?: String, gifPlayback?: Boolean, jpegThumbnail?: String | URL, msg?: String, mentions: String[]}} options Options Message => {caption: teks, gifplayback: boolean, jpegThumbnail: url, msg: WAMessage}
 * @returns 
 */
const sendVideo = async (from, buff, options = {}) => {
	if (typeof buff === 'string') {
		const msg_result = await wa.sendMessage(from, { caption: options.caption, gifPlayback: options.gifPlayback, video: { url: buff }, mentions: options.mentions }, { quoted: options.msg });
		return msg_result;
	} else {
		const msg_result = await wa.sendMessage(from, { caption: options.caption, gifPlayback: options.gifPlayback, video: buff, mentions: options.mentions }, { quoted: options.msg });
		return msg_result;
	}
}

/**
 * 
 * @param {String} from groupId atau user_id
 * @param {URL | Buffer} buff  Url atau Buffer
 * @param {{fileName?: String, mimetype?: String, quoted?: String, mentions: String[]}} options Options Message => {fileName : teks, mimetype: video/webm | audio/webm | application/pdf, quoted: chat}
 * @returns 
 */
const sendDocument = async (from, buff, options = {}) => {
	if (typeof buff === 'string') {
		const msg_result = await wa.sendMessage(from, { document: { url: buff }, fileName: options.fileName, mimetype: options.mimetype, mentions: options.mentions }, { quoted: options.quoted });
		return msg_result;
	} else {
		const msg_result = await wa.sendMessage(from, { document: buff, fileName: options.fileName, mimetype: options.mimetype, mentions: options.mentions }, { quoted: options.quoted });
		return msg_result;
	}
}

/**
 * 
 * @param {String} from groupId atau user_id
 * @param {URL | Buffer} buff Url atau Buffer
 * @param {Boolean} isAnimated True or False
 * @param {{height?: Number, width?: Number, msg?: String, mentions?: String[]}} options Options Message => Example {height: 100, width: 80}
 * @returns 
 */
const sendSticker = async (from, buff, isAnimated, options = {}) => {
	if (typeof buff === 'string') {
		const msg_result = await wa.sendMessage(from, { sticker: { url: buff }, isAnimated } || { height: options.height, width: options.width, mentions: options.mentions }, { quoted: options.msg });
		return msg_result;
	} else {
		const msg_result = await wa.sendMessage(from, { sticker: buff, isAnimated } || { height: options.height, width: options.width, mentions: options.mentions }, { quoted: options.msg });
		return msg_result;
	}
}

/**
 * 
 * @param {String} from groupId atau user_id
 * @param {URL | Buffer} buff Url atau Buffer
 * @param {{height?: Number, width?: Number, msg?: String, mentions: String[]}} options Options Message => Example {height: 100, width: 80}
 * @returns 
 */
const sendStickerAsImage = async (from, buff, options = {}) => {
	if (typeof buff === 'string') {
		const webpRes = await pngToWebpFromUrl(buff);
		const msg_result = await wa.sendMessage(from, { sticker: { url: webpRes } } || { height: options.height, width: options.width, mentions: options.mentions }, { quoted: options.msg });
		return msg_result;
	} else {
		const webpRes = await pngToWebpFromBuffer(buff);
		const msg_result = await wa.sendMessage(from, { sticker: readFileSync(webpRes) } || { height: options.height, width: options.width, mentions: options.mentions }, { quoted: options.msg });
		return msg_result;
	}
}

/**
 * 
 * @param {String} from 
 * @param {URL | Buffer} buff 
 * @param {{caption?: String, gifPlayback?: Boolean, jpegThumbnail?: String | URL, gifPlayback?: Boolean, quoted?: String}} options Options Message => {caption: teks, gifplayback: boolean, jpegThumbnail: url, quoted: chat}
 * @returns 
 */
const sendMedia = async (from, buff, options = {}) => {
	if (typeof buff === 'string') {
		const type = await axios.head(buff).then(res => res.headers['content-type'].split('/')[0]);
		if (type === 'image') {
			const msg_result = await wa.sendMessage(from, { caption: options.caption, image: { url: buff }, jpegThumbnail: options.jpegThumbnail }, { quoted: options.quoted });
			return msg_result;
		} else if (type === 'video' || type === 'octet') {
			const msg_result = await wa.sendMessage(from, { caption: options.caption, gifPlayback: options.gifPlayback, video: { url: buff } }, { quoted: options.quoted });
			return msg_result;
		}
	} else {
		const type = await fromBuffer(buff);
		if (type === 'image') {
			const msg_result = await wa.sendMessage(from, { caption: options.caption, image: buff, jpegThumbnail: options.jpegThumbnail }, { quoted: options.quoted });
			return msg_result;
		} else if (type === 'video' || type === 'octet') {
			const msg_result = await wa.sendMessage(from, { caption: options.caption, gifPlayback: options.gifPlayback, video: buff }, { quoted: options.quoted });
			return msg_result;
		}
	}
}

/**
 * 
 * @param {String} from groupId atau user_id
 * @param {String[]} buttons Tombol yang akan dikirim
 * @param {{text: String, footer: String}} options Example => Di Bawah
 * @returns 
 * @example const buttons = [
{buttonId: 'id1', buttonText: {displayText: 'Button 1'}, type: 1},
{buttonId: 'id2', buttonText: {displayText: 'Button 2'}, type: 1},
{buttonId: 'id3', buttonText: {displayText: 'Button 3'}, type: 1}
]
const result = sendButton(from, buttons, {text: 'Teks utama', footer: 'Teks Bawah'})
 */
const sendButton = async (from, buttons, options = {}) => {
	const buttonMessage = {
		text: options.text ? options.text : '',
		footer: options.footer ? options.footer : '',
		buttons: buttons,
		headerType: 1
	}
	const msg_result = await wa.sendMessage(from, buttonMessage)
	return msg_result;
}

/**
 * 
 * @param {String} from user_id atau groupId
 * @param {String[]} buttons Isi Buttons
 * @param {URL | Buffer} image Foto yang akan dikirim bareng button
 * @param {{caption?: String, footer?: String, viewOnce: boolean}} options 
 * @returns
 * @example const buttons = [
{buttonId: 'id1', buttonText: {displayText: 'Button 1'}, type: 1},
{buttonId: 'id2', buttonText: {displayText: 'Button 2'}, type: 1},
{buttonId: 'id3', buttonText: {displayText: 'Button 3'}, type: 1}
]
const result = await sendButtonWithImage(from, buttons, 'https://i.ibb.co/27TMSmd/Whats-App-Image-2022-01-02-at-21-26-32.jpg', {text: 'Teks utama', footer: 'Teks Bawah'})
 */
const sendButtonWithImage = async (from, buttons, image, options = {}) => {
	let buttonMessage = {};
	if (typeof image === 'string') {
		buttonMessage = {
			image: { url: image },
			caption: options.caption ? options.caption : '',
			footer: options.footer ? options.footer : '',
			buttons: buttons,
			headerType: 4,
			viewOnce: options.viewOnce
		}
	} else {
		buttonMessage = {
			image: image,
			caption: options.caption ? options.caption : '',
			footer: options.footer ? options.footer : '',
			buttons: buttons,
			headerType: 4,
			viewOnce: options.viewOnce
		}
	}
	const msg_result = await wa.sendMessage(from, buttonMessage)
	return msg_result;
}

/**
 * 
 * @param {String} from user_id atau groupId
 * @param {String[]} templateButtons Isi Template Buttons
 * @param {{text?: String, footer?: String, viewOnce: boolean}} options 
 * @example const templateButtons = [
{index: 1, urlButton: {displayText: '⭐ Star Baileys on GitHub!', url: 'https://github.com/adiwajshing/Baileys'}},
{index: 2, callButton: {displayText: 'Call me!', phoneNumber: '+1 (234) 5678-901'}},
{index: 3, quickReplyButton: {displayText: 'This is a reply, just like normal buttons!', id: 'id-like-buttons-message'}},
]

const result = sendTemplateButton(from, templateButtons, {text: 'Teks Utama', footer: 'Teks Bawah/Footer'})
 */
const sendTemplateButton = async (from, templateButtons, options = {}) => {
	const templateMessage = {
		text: options.text,
		footer: options.footer,
		templateButtons,
		viewOnce: options.viewOnce
	}
	const msg_result = await wa.sendMessage(from, templateMessage);
	return msg_result;
}

// /**
//  * 
//  * @param {String} from user_id atau groupId
//  * @param {String[]} templateButtons 
//  * @param {URL | Buffer} image
//  * @param {{text?: String, footer?: String}} options 
//  * @returns 
//  */
// const sendTemplateButtonWithImage = async (from, templateButtons, image, options = {}) => {
// 	let templateMessage = {};
// 	if (typeof image === 'string') {
// 		templateMessage = {
// 			image: { url: image },
// 			text: options.text,
// 			footer: options.footer,
// 			templateButtons,
// 		}
// 	} else {
// 		templateMessage = {
// 			image: image,
// 			text: options.text,
// 			footer: options.footer,
// 			templateButtons
// 		}
// 	}
// 	const msg_result = await wa.sendMessage(from, templateMessage);
// 	return msg_result;
// }

/**
 * 
 * @param {String} from user_id atau groupId
 * @param {String[]} templateButtons 
 * @param {URL | Buffer} image
 * @param {{ title: String, content?: String, footer?: String, quoted?: proto.WebMessageInfo}} options 
 * @returns 
 * @example const templateButtons = [{
	urlButton: {
		displayText: 'Text 1',
		url: ''
	}
}, {
	callButton: {
		displayText: 'text 2',
		phoneNumber: ''
	}
}, {
	quickReplyButton: {
		displayText: 'Buttton 3',
		id: 'id 1'
	}
}, {
	quickReplyButton: {
		displayText: 'Button 4',
		id: 'id 2'
	}
}, {
	quickReplyButton: {
		displayText: 'Button 5',
		id: 'id 3'
	}
}]
 */
const sendTemplateButtonWithImage = async (from, templateButtons, image, options = {}) => {
	const message = await prepareWAMessageMedia({ image: image }, { upload: wa.waUploadToServer })
	const template = generateWAMessageFromContent(from, proto.Message.fromObject({
		templateMessage: {
			hydratedTemplate: {
				imageMessage: message.imageMessage,
				hydratedTitleText: options.title,
				hydratedContentText: 'Testing',
				hydratedFooterText: options.footer,
				hydratedButtons: templateButtons,
			}
		}
	}), { userJid: from, quoted: options.quoted })
	return wa.relayMessage(from, template.message, { messageId: template.key.id });
}

/**
 * 
 * @param {String} from 
 * @param {String[]} sections
 * @param {{title?: String, text?: String, footer?: String, buttonText?: String}} options 
 * @returns
 * @example const sections = [
{
	title: "Section 1",
	rows: [
		{title: "Option 1", rowId: "option1"},
		{title: "Option 2", rowId: "option2", description: "This is a description"}
	]
},
{
	title: "Section 2",
	rows: [
		{title: "Option 3", rowId: "option3"},
		{title: "Option 4", rowId: "option4", description: "This is a description V2"}
	]
}
]

const result = await sendListMessage(from, sections, {title: 'Titlenya', text: 'Teks Utama', footer: 'Teks Bawah/Footer', butttonText: 'Teks Buttonnya'})
 */
const sendListMessage = async (from, sections, options = {}) => {
	const listMessage = {
		text: options.text,
		footer: options.footer,
		title: options.title,
		buttonText: options.buttonText,
		sections
	}
	const msg_result = await wa.sendMessage(from, listMessage);
	return msg_result;
}

/**
 * 
 * @param {String} from 
 * @param {String[]} sections 
 * @param {URL | Buffer} image
 * @param {{title?: String, text?: String, footer?: String, buttonText?: String}} options 
 * @returns 
 */
const sendListMessageWithImage = async (from, sections, image, options = {}) => {
	let listMessage = {};
	if (typeof image === 'string') {
		listMessage = {
			image: { url: image },
			text: options.text,
			footer: options.footer,
			title: options.title,
			buttonText: options.buttonText,
			sections
		}
	} else {
		listMessage = {
			image: image,
			text: options.text,
			footer: options.footer,
			title: options.title,
			buttonText: options.buttonText,
			sections
		}
	}
	const msg_result = await wa.sendMessage(from, listMessage);
	return msg_result;
}

/**
 * 
 * @param {String} pack Nama Pack 
 * @param {String} auth 
 */
const createExif = (pack, auth) => {
	const code = [0x00, 0x00, 0x16, 0x00, 0x00, 0x00]
	const exif = { "sticker-pack-id": "com.client.tech", "sticker-pack-name": pack, "sticker-pack-publisher": auth, "android-app-store-link": "https://play.google.com/store/apps/details?id=com.termux", "ios-app-store-link": "https://itunes.apple.com/app/sticker-maker-studio/id1443326857" }
	let len = JSON.stringify(exif).length
	if (len > 256) {
		len = len - 256
		code.unshift(0x01)
	} else {
		code.unshift(0x00)
	}
	if (len < 16) {
		len = len.toString(16)
		len = "0" + len
	} else {
		len = len.toString(16)
	}
	//len = len < 16 ? `0${len.toString(16)}` : len.toString(16)
	const _ = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00]);
	const __ = Buffer.from(len, "hex")
	const ___ = Buffer.from(code)
	const ____ = Buffer.from(JSON.stringify(exif))
	writeFileSync('./temp/data.exif', Buffer.concat([_, __, ___, ____]), function (err) {
		console.log(err)
		if (err) return console.error(err)
		return `./stik/data.exif`
	})

}


module.exports = { connection, downloadMediaWa, createExif, sendText, reply, sendAudio, sendImage, sendVideo, sendDocument, sendSticker, sendStickerAsImage, sendMedia, sendButton, sendButtonWithImage, getBuffer, sendTemplateButton, sendTemplateButtonWithImage, sendListMessage, sendListMessageWithImage };


// Send Audio/Video with media preview => contextInfo >> externalAdReply

// let message = await prepareWAMessageMedia({ image: fs.readFileSync('./lib/coba.jpg') }, { upload: hisoka.waUploadToServer })
// const template = generateWAMessageFromContent(m.chat, proto.Message.fromObject({
// 	templateMessage: {
// 		hydratedTemplate: {
// 			imageMessage: message.imageMessage,
// 			hydratedContentText: anu,
// 			hydratedButtons: [{
// 				urlButton: {
// 					displayText: 'Source Code',
// 					url: 'https://github.com/Dioazharii'
// 				}
// 			}, {
// 				callButton: {
// 					displayText: 'Number Phone Owner',
// 					phoneNumber: ''
// 				}
// 			}, {
// 				quickReplyButton: {
// 					displayText: 'Status Bot',
// 					id: 'ping'
// 				}
// 			}, {
// 				quickReplyButton: {
// 					displayText: 'Contact Owner',
// 					id: 'owner'
// 				}
// 			}, {
// 				quickReplyButton: {
// 					displayText: 'Script',
// 					id: 'sc'
// 				}
// 			}]
// 		}
// 	}
// }), { userJid: m.chat, quoted: m })
// client.relayMessage(m.chat, template.message, { messageId: template.key.id })