const moment = require('moment');
moment.locale('id');

const ModelDb = require('../models/index');
const db = new ModelDb();

const menu = async (msg) => {
    /* It's assigning the value of the `msg` object to the variables `pushname`, `prefix`, `runtime`,
    and `ucapanWaktu`. */
    const { pushName, prefix, runtime, ucapanWaktu, time } = msg;
    return `Hai.. ${pushName} 
${ucapanWaktu}👋

Prefix : 「 ${prefix} 」
Note : Untuk melihat panduan semua menu bot ketik ${prefix}help atau ${prefix}help <nama command>


 *↱『 Admin-Group 』*
➾ ${prefix}add [Menambahkan member ke Grup] <tag membernya>
➾ ${prefix}kick [Mengeluarkan member dari Grup] <tag membernya>
➾ ${prefix}delete [Menghapus pesan dari bot] <tag pesan bot>
➾ ${prefix}groupinfo [Informasi Grup]
➾ ${prefix}hidetag [Tag all] <textnya>
➾ ${prefix}totag [Jadikan tag all] <Tag text, image atau lainnya untuk jadikan tag all>
➾ ${prefix}leave [Bot keluar dari Grup]
➾ ${prefix}linkgroup [Mengambil info link Grup]
➾ ${prefix}group [Buka dan tutup Grup] <open atau close>
➾ ${prefix}promote [Menaikkan Jabatan Member] <tag membernya>
➾ ${prefix}demote [Menurunkan Jabatan Admin] <tag membernya>

 *↱『 Maker & Convert 』*
➾ ${prefix}sticker [Konversi gambar/video ke stiker] <tag gambar/video>
➾ ${prefix}toimg [Konversi stiker ke gambar] <tag stiker>
➾ ${prefix}togif [Konversi stikergif ke gif] <tag stiker bergerak>
➾ ${prefix}tomp3 [Konversi video ke mp3] <tag video>
➾ ${prefix}emoji [Konversi emoji ke sticker]
➾ ${prefix}emojimix [Gabungkan emoji dan konversi ke sticker]

 *↱『 Education 』*
➾ ${prefix}brainly [Mencari Jawaban di brainly] <pertanyaannya>
➾ ${prefix}kbbi [Mencari kata di KBBI] <kata>

 *↱『 Islami 』*
➾ ${prefix}quran [Mencari isi Al-Quran berdasaran Surat atau Surat dan Ayatnya] <surat | ayat>

 *↱『 Anime 』*
➾ ${prefix}wait [Mencari Info Anime dari gambar yang dikirim] <tag gambar>

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

 *↱『 Owner-Bot 』*
➾ ${prefix}join
➾ ${prefix}broadcast
➾ ${prefix}selfbot
➾ ${prefix}public
➾ ${prefix}maintenance
➾ ${prefix}chatread

*Info Bot*
>> *Nama Bot : Yu-Bot*
>> *Versi Bot : 1.0.0 (BETA)*
>> *Total user Bot : ${(await db.findAllUser()).length}*
>> *Runtime : ${runtime}*
>> *Waktu Server : ${time} WIB*
>> *Tanggal : ${await tanggal()}*

*⋘ YU-BOT ⋙*
`
}

const help = async (msg) => {
    const { pushName, prefix, runtime, ucapanWaktu, time } = msg;
    return `Hai.. ${pushName} 
${ucapanWaktu} dan Selamat datang di Yu-Bot

Sebelum memakai bot mohon di baca dulu panduan di bawah ini..

Note : Untuk melihat panduan sesuai commandnya ketik ${prefix}help <nama command>

*Panduan Menu Bot*

    *『 Admin-Group 』*
➾ ${prefix}add [Menambahkan orang ke grup]
    - Format : ${prefix}add <tag membernya>
    - Contoh : ${prefix}add @628171349476
➾ ${prefix}kick [Mengeluarkan orang dari grup]
    - Format : ${prefix}kick <tag membernya>
    - Contoh : ${prefix}kick @628393749407
➾ ${prefix}delete [Menghapus/menarik pesan dari bot]
    - Format : ${prefix}delete <tag pesan bot>
➾ ${prefix}groupinfo [Informasi Grup]
➾ ${prefix}hidetag/h [Tag all hide]
    - Format : ${prefix}hidetag/h <Text yang mau dijadikan hidetag>
    - Contoh : ${prefix}hidetag Halo Gaess
➾ ${prefix}totag [jadikan text, image atau lainnya menjadi hidetag]
    - Format : ${prefix}totag <Tag text, image atau lainnya untuk jadikan hidetag>
➾ ${prefix}leave [Untuk mengeluarkan bot dari grup]
➾ ${prefix}linkgroup [Untuk mengambil link grup]
➾ ${prefix}group [Untuk membuka atau menutup grup]
    - Format : ${prefix}group <open atau close>
    - Contoh : ${prefix}group open
➾ ${prefix}promote [Untuk mnenaikkan jabatan orang di grup]
    - Format : ${prefix}promote <tag membernya>
    - Contoh : ${prefix}promote @628192736394
➾ ${prefix}demote [Untuk menurunkan jabatan orang di grup]
    - Format : ${prefix}demote <tag membernya>
    - Contoh : ${prefix}demote @62819282944

    *『 Maker & Convert 』*
➾ ${prefix}sticker [Merubah gambar/foto menjadi sticker]
    - Format : ${prefix}sticker <pack name> <full>
    - Contoh 👇
    Stiker Biasa : Kirim gambar/video atau tag gambar/video dengan caption ${prefix}sticker (Cropped)
    Stiker Full : Kirim gambar/video atau tag gambar/video dengan caption ${prefix}sticker full (Full)
    Stiker Biasa + WM : Kirim gambar/video atau tag gambar/video dengan caption ${prefix}sticker Stazyu @wahyuhp59 (Cropped + WM)
    Stiker Full + WM : Kirim gambar/video atau tag gambar/video dengan caption ${prefix}sticker Stazyu @wahyuhp59 Full (Full + WM)
➾ ${prefix}takesticker [Merubah packname sticker]
    - Format : ${prefix}takesticker <pack name>
    - Contoh : Kirim gambar/video atau tag gambar/video dengan caption ${prefix}takesticker Stazyu @wahyuhp57
➾ ${prefix}toimg [Merubah sticker menjadi gambar]
    - Format : ${prefix}toimg 
    - Contoh : Tag sticker yang mau dijadikan gambar dengan caption ${prefix}toimg
➾ ${prefix}togif [Merubah sticker menjadi gif]
    - Format : ${prefix}togif 
    - Contoh : Tag sticker yang mau dijadikan gif dengan caption ${prefix}togif
➾ ${prefix}tomp3 [Merubah video menjadi musik]
    - Format : ${prefix}tomp3
    - Contoh : Tag video yang mau diajdikan musik dengan caption ${prefix}tomp3
➾ ${prefix}emoji [Merubah emoji menjadi sticker]
    - Format : ${prefix}emoji <emojinya>
    - Contoh : ${prefix}emoji 😍
➾ ${prefix}emojimix [Menggabungkan emoji dan dijadikan stiker]
    - Format : ${prefix}emojimix <emoji1 + emoji2>
    - Contoh : ${prefix}emojimix 😍 + 🤗

    *『 Education 』*
➾ ${prefix}brainly [Mencari Jawaban di brainly]
    - Format : ${prefix}brainly <Pertanyaannya> <Jumlah Jawaban?>
    - Contoh : ${prefix}brainly Apa itu kucing? 7
➾ ${prefix}kbbi [Mencari kata di KBBI]
    - Format : ${prefix}kbbi <kata>
    - Contoh : ${prefix}kbbi sabar

    *『 Islami 』*
➾ ${prefix}quran [Search surah & ayah]
    - Format : ${prefix}quran <surah | ayah>
    - Contoh 1 : ${prefix}quran 1 (Full 1 surah)
    - Contoh 2 : ${prefix}quran 1 | 2 (Only Ayah)

    *『 Anime 』*
➾ ${prefix}wait [Search Anime by image]
    -Format : ${prefix}wait <Tag foto anime>

    *『 Media & Download 』*
➾ ${prefix}titlesearch [Cari judul lagu dari music yang dikirim] 
    - Format : ${prefix}titlesearch <Tag audio yang dikirim>
➾ ${prefix}play [Download lagu lewat judul]
    - Format : ${prefix}play <Judul Lagu>
    - Contoh : ${prefix}play Night Changes
➾ ${prefix}ytdl [Download Video/Audio di YouTube]
    - Format : ${prefix}ytdl <Link Youtube>
    - Contoh : ${prefix}ytdl https://www.youtube.com/watch?v=tCf4-bbLyuE
➾ ${prefix}igdl [Download Post Instagram]
    - Format : ${prefix}igdl <Link Instagram>
    - Contoh : ${prefix}igdl https://www.instagram.com/reel/CbCY1uoLQfd/?utm_source=ig_web_copy_link
➾ ${prefix}tikdl [Download Post Tiktok]
    - Format : ${prefix}tikdl <Link Tiktok>
    - Contoh : ${prefix}tikdl https://www.tiktok.com/@triopotatoes/video/7027492366026083611
➾ ${prefix}pintdl [Download Post Pinterest]
    - Format : ${prefix}pintdl <Link Pinterest>
    - Contoh : ${prefix}pintdl https://pin.it/6grMZzz
➾ ${prefix}fbdl [Download Video Facebook]
    - Format : ${prefix}fbdl <Link Facebook>
    - Contoh : ${prefix}fbdl https://fb.watch/bJHUIDms9H/
➾ ${prefix}igstalk [Stalking Instagram]
    - Format : ${prefix}igstalk <Username Instagram>
    - Contoh : ${prefix}igstalk wahyuhp57
➾ ${prefix}pinterest [Cari foto di Pinterest]
    - Format : ${prefix}pinterest <Query>
    - Contoh : ${prefix}pinterest Kucing
➾ ${prefix}ytsearch [Cari lagu/video di Youtube]
    - Format : ${prefix}ytsearch <Query>
    - Contoh : ${prefix}ytsearch Night Changes
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
    },
    menu: {
        emoji: 'Merubah Emoji menjadi sticker\n\n${prefix}emoji\nFormat: '
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

module.exports = { menu, mess, help }