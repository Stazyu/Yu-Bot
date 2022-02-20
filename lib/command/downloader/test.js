const { unlinkSync, readFileSync } = require("fs-extra");
const { prepareWAMessageMedia, generateWAMessageFromContent, proto } = require('@adiwajshing/baileys');
const { downloadMediaWa, sendText, sendAudio, sendButton, sendButtonWithImage, getBuffer, sendListMessage, sendListMessageWithImage, sendTemplateButton, sendTemplateButtonWithImage, sendImage, reply } = require("../../functions")
const { default: axios } = require("axios");
const { exec } = require('child_process');
const { randomString } = require("../../../helpers/generate");
const path = require('path');

module.exports = {
	name: 'tes',
	command: ['test', 'tes'],
	category: 'testing',
	isOwner: true,
	async execute(msg, conn) {
		const { from, messageType, isQuotedImage, isQuotedAudio, chat } = msg;
		if (messageType === 'audioMessage' || isQuotedAudio || true) {
			// const buff = await getBuffer('https://i.ibb.co/27TMSmd/Whats-App-Image-2022-01-02-at-21-26-32.jpg');
			// const url = 'https://i.ibb.co/27TMSmd/Whats-App-Image-2022-01-02-at-21-26-32.jpg'

			const out = path.join(__dirname, '../../../temp', randomString(4, { extension: '.png' }));
			const { path: pathOut, buffer } = await downloadMediaWa(msg, '.webp');
			exec(`ffmpeg -i ${pathOut} ${out}`, async (err) => {
				if (err) throw new Error('Gagal konversi stiker ke gambar!');
				await sendImage(from, out, { capt: 'Done. Konversi stiker ke gambar!' });
				unlinkSync(pathOut);
				unlinkSync(out);
			})
		}
	}
}