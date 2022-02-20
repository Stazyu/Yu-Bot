const fs = require('fs');
const FormData = require('form-data');
const { default: axios } = require('axios');
const cheerio = require('cheerio');

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

module.exports = { webp2gifFile }