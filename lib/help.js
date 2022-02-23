const moment = require('moment');
moment.locale('id');

// let ucapanWaktu = ''
// if (time <= "03:30:00") {
//     ucapanWaktu = 'Selamat Malam'
// } else if (time <= "11:00:00") {
//     ucapanWaktu = 'Selamat Pagi'
// } else if (time <= "15:00:00") {
//     ucapanWaktu = "Selamat Siang"
// } else if (time <= "18:00:00") {
//     ucapanWaktu = "Selamat Sore"
// } else if (time <= "20:00:00") {
//     ucapanWaktu = "Selamat Petang"
// } else if (time <= "23:59:00") {
//     ucapanWaktu = "Selamat Malam"
// }

const menu = async (msg) => {
    /* It's assigning the value of the `msg` object to the variables `pushname`, `prefix`, `runtime`,
    and `ucapanWaktu`. */
    const { pushname, prefix, runtime, ucapanWaktu, time } = msg;
    return `Hai.. ${pushname} 
${ucapanWaktu}👋

Prefix : 「 ${prefix} 」

 *↱『 Owner-Bot 』*
 ➾ ${prefix}join
 ➾ ${prefix}broadcast


 *↱『 Admin-Group 』*
 ➾ ${prefix}add <tag membernya>
 ➾ ${prefix}kick <tag membernya>
 ➾ ${prefix}delete <tag pesan bot>
 ➾ ${prefix}groupinfo 
 ➾ ${prefix}hidetag <textnya>
 ➾ ${prefix}totag <Tag text, image atau lainnya untuk jadikan tag all>
 ➾ ${prefix}leave
 ➾ ${prefix}linkgroup
 ➾ ${prefix}group <open atau close>
 ➾ ${prefix}promote <tag membernya>
 ➾ ${prefix}demote <tag membernya>

 *↱『 Toogle Auto Command 』*
 Dalam Proses
 
 *↱『 Maker & Convert 』*
➾ ${prefix}sticker
➾ ${prefix}stickerwm
➾ ${prefix}toimg
➾ ${prefix}togif 
➾ ${prefix}tomp3 
➾ ${prefix}emoji 

 *↱『 Education 』*
➾ ${prefix}brainly [Mencari Jawaban di brainly]

 *↱『 Islami 』*
 Dalam Proses

 *↱『 Anime 』*
➾ ${prefix}wait [Search Anime by image]

 *↱『 Media & Download 』*
➾ ${prefix}titlesearch [Cari judul lagu dari music yang dikirim] 
➾ ${prefix}play [Download lagu lewat judul]
➾ ${prefix}ytdl [Download Video/Audio di YouTube]
➾ ${prefix}igdl [Download Post Instagram ]
➾ ${prefix}tikdl [Download Post Tiktok] 
➾ ${prefix}pintdl [Download Post Pinterest]
➾ ${prefix}fbdl [Download Video Facebook]
➾ ${prefix}igstalk [Stalking Instagram] (Dalam Proses)
➾ ${prefix}pinterest [Cari foto di Pinterest]
➾ ${prefix}ytsearch [Cari lagu/video di Youtube]

 *↱『 Fun 』*
 Dalam Proses

 *↱『 Other 』*
 Dalam Proses

*Info Bot*
>> *Nama Bot : Yu-Bot*
>> *Versi Bot : 1.0.0 (BETA)*
>> *Total user terverifikasi : -*
>> *Runtime : ${runtime}*
>> *Waktu Server : ${time} WIB*
>> *Tanggal : ${await tanggal()}*

*⋘ YU-BOT ⋙*
`
}

/**
 * 
 * @returns messageInfo
 */
const mess = {
    wait: 'Mohon di tunggu, permintaan sedang di proses..',
    error: {
        stick: 'Gagal, terjadi kesalahan saat mengkonversi gambar ke sticker!',
        Iv: 'Link tidak valid! ',
        link: 'Maaf terjadi kesalahan, Silahkan coba beberapa saat lagi.. bila error berlanjut segera lapor ke Owner Bot!',
        system: 'Maaf terjadi masalah pada sistem, bila masalah berlanjut segera lapor ke Owner Bot!',
    },
    media: {
        ytdl: 'Format salah!\n\nFormat : ${prefix}ytdl <link youtube>\nContoh: ${prefix}ytdl https://youtu.be/zCJZyBcVdbs',
        igdl: 'Format salah!\n\nFormat : ${prefix}igdl <link instagram>\nContoh: ${prefix}igdl https://www.instagram.com/p/CXI0jIdAnf-/?utm_source=ig_web_copy_link',
        tikdl: 'Format salah!\n\nFormat : ${prefix}tikdl <link tiktok>\nContoh: ${prefix}tikdl https://www.tiktok.com/@triopotatoes/video/7027492366026083611',
        pintdl: 'Format salah!\n\nFormat : ${prefix}pintdl <link pinterest>\nContoh: ${prefix}pintdl https://pin.it/2PWlvx1',
        fbdl: 'Format salah!\n\nFormat : ${prefix}fbdl <link pinterest>\nContoh: ${prefix}fbdl https://fb.watch/9KDmPExb0a/',
    },
    info: {
        onlyGroup: 'Maaf, fitur hanya bisa digunakan di Group!'
    }
}

// Tanggal Indo + Jawa
function tanggal() {
    return new Promise(resolve => {
        var pasaran = new Array('Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon');
        var hari = moment().format('dddd');
        var tgal = moment().format('DD MMMM YYYY')
        var d2 = moment('2014-01-27');
        var d1 = moment();
        var selisih = Math.floor(Math.abs(d1 - d2) / 86400000);
        var pasar = pasaran[selisih % 5];
        const tgl = `${hari} ${pasar}, ${tgal}`
        resolve(tgl)
    })
}

module.exports = { menu, mess }