module.exports = {
	name: 'tes',
	aliases: ['test2', 'tes2'],
	category: 'testing',
	async execute(msg, sock, from) {
		// conn.sendMessage(from, { text: 'yoo mantap joss' })
		await sock.sendMessage(
			from, { audio: { url: "./adele-easy-on-me-rock-cover-by-no-resolve.mp3" }, mimetype: 'audio/mp4' }
		)
	}
}