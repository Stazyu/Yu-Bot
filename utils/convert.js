const fs = require('fs');
const FormData = require('form-data');
const { default: axios } = require('axios');
const cheerio = require('cheerio');
const { fromBuffer } = require('file-type');
const path = require('path');
const { randomString } = require('../helpers/generate');
const { exec } = require('child_process');

const webp2gifFile = (path) => {
    return new Promise((resolve, reject) => {
        const bodyForm = new FormData()
        bodyForm.append('new-image-url', '')
        bodyForm.append('new-image', fs.createReadStream(path))
        axios({
            method: 'post',
            url: 'https://s6.ezgif.com/webp-to-mp4',
            data: bodyForm,
            headers: {
                'Content-Type': `multipart/form-data; boundary=${bodyForm._boundary}`
            }
        }).then(({
            data
        }) => {
            const bodyFormThen = new FormData();
            const $ = cheerio.load(data);
            const file = $('input[name="file"]').attr('value');
            const convert = $('input[name="convert"]').attr('value');
            const gotdata = {
                file: file,
                convert
            }
            bodyFormThen.append('file', gotdata.file);
            bodyFormThen.append('convert', gotdata.convert);
            axios({
                method: 'post',
                url: 'https://ezgif.com/webp-to-mp4/' + gotdata.file,
                data: bodyFormThen,
                headers: {
                    'Content-Type': `multipart/form-data; boundary=${bodyFormThen._boundary}`
                }
            }).then(({
                data
            }) => {
                const $ = cheerio.load(data)
                const result = 'https:' + $('div#output > p.outfile > video > source').attr('src')
                resolve(result)
            }).catch(err => reject(err))
        }).catch(err => reject(err))
    })
}

const upToTele = (buff) => {
    return new Promise(async (resolve, reject) => {
        const { ext } = await fromBuffer(buff)
        const form = new FormData();
        form.append('file', buff, 'tmp' + ext);
        axios({
            url: 'https://telegra.ph/upload',
            method: 'post',
            headers: {
                'content-type': 'multipart/form-data; boundary=' + form.getBoundary()
            },
            data: form
        })
            .then((res) => {
                const url = `https://telegra.ph${res.data[0].src}`;
                resolve(url);
                resolve(res);
            }).catch((err) => {
                reject(err);
            });
    })
}

const pngToWebpFromUrl = (url) => {
    return new Promise(async (resolve, reject) => {
        const filename = path.join(__dirname, '../temp', randomString(4, { extension: '.png' }));
        const webp = path.join(__dirname, '../temp', randomString(4, { extension: '.webp' }));
        const download = await axios.get(url, {
            responseType: 'stream',
        });
        download.data.pipe(fs.createWriteStream(filename).on('close', () => {
            // exec(`cwebp -q 60 ${filename} -o ${webp}`, (err) => {
            exec(`ffmpeg -i ${filename} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${webp}`, (err) => {
                if (err) return reject(err);
                resolve(webp);
                fs.unlinkSync(filename);
            })
        }))
    })
}

module.exports = { webp2gifFile, upToTele, pngToWebpFromUrl }