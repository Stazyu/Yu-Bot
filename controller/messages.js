// Sementara belum di pake

class Serialize {

	constructor(sock, chat) {
		chat = chat.messages[0];

		/* ========== Meta Utama ========== */
		this.message = chat.message;
		this.id = chat.key.id;
		this.from = chat.key.remoteJid;
		this.fromMe = chat.key.fromMe;
		this.participant = chat.key.participant;
		this.isGroup = this.from.endsWith('@g.us');
		this.content = JSON.stringify(chat.message);
		this.typeMessage = Object.keys(chat.message)[0];
		this.messageTimestamp = chat.messageTimestamp;
		this.botNumber = String(sock.user.id).split(':')[0] + '@s.whatsapp.net';

		/* ============ Meta User & Owner ============ */
		this.user_id = this.isGroup ? chat.key.participant : chat.key.remoteJid;
		this.pushname = chat.pushName;
		this.ownerNumber = sock.owner.map((nomor, i) => {
			return this.formatter(nomor, "@s.whatsapp.net");
		})
		this.isOwner = this.ownerNumber.includes(this.user_id) || false

		/* ============ Meta Group ============= */
		if (this.isGroup) this.groupMetadata = async () => {
			const groupMetadata = this.isGroup ? await sock.groupMetadata(this.from) : null;
			return { groupMetadata };
		}
		this.groupName = this.isGroup ? this.groupMetadata.subject : null;
		// this.groupId =

		/* ============ Meta Advanced ============ */


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

}


module.exports = Serialize