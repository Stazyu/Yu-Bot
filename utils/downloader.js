const cheerio = require('cheerio')
const { default: axios } = require('axios')
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const ytdlcore = require('ytdl-core')
const qs = require('qs')
const { NodeVM } = require('vm2');

function secondToFormatClock(s) {
    return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s
}

/**
 * It downloads the video from the given url.
 * @param url - The url of the video you want to download.
 * @returns The return value is a Promise.
 */
function downloader(url) {
    return new Promise((resolve, reject) => {
        axios.request({
            url: 'https://aiovideodl.ml/',
            method: 'GET',
            headers: {
                "accept": 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                "cookie": 'pll_language=en; PHPSESSID=65e21fe835973041fd6a2eb8ebc65635',
                "user-agent": 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
            }
        }).then(({ data }) => {
            const $ = cheerio.load(data);
            const token = $('#token').attr('value')
            let config = {
                headers: {
                    "content-type": 'application/x-www-form-urlencoded',
                    "cookie": 'pll_language=en; PHPSESSID=65e21fe835973041fd6a2eb8ebc65635',
                    "user-agent": 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
                },
                data: {
                    "url": url,
                    "action": 'post',
                    "token": token
                }
            }
            axios.post('https://aiovideodl.ml/wp-json/aio-dl/video-data/', qs.stringify(config.data), { headers: config.headers })
                .then((result) => {
                    resolve({
                        author: 'Staz-Yu',
                        status: 200,
                        result: result.data
                    })
                }).catch((err) => {
                    reject(err)
                });
        }).catch(err => {
            reject(err)
        })
    });
}

/**
 * It downloads the video from YouTube and converts it to mp3 and mp4.
 * @param url - The URL of the YouTube video you want to download.
 */
async function ytdDownload(url) {
    return new Promise((resolve, reject) => {
        const config = {
            headers: {
                "content-type": 'application/x-www-form-urlencoded; charset=UTF-8',
                "user-agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Mobile Safari/537.36"
            },
            data: {
                "q": url,
                "vt": "home"
            }
        }
        axios.post('https://yt1s.com/api/ajaxSearch/index', qs.stringify(config.data), { headers: config.headers })
            .then(async (res) => {
                const mp4Result = Object.values(res.data.links.mp4).find((i) => {
                    return i.q === '720p' ? i.q === '720p' : i.q === '360p'
                })
                const formMp3128Kbps = {
                    vid: res.data.vid,
                    k: res.data.links.mp3.mp3128.k
                }
                const formMp4720p = {
                    vid: res.data.vid,
                    k: mp4Result.k
                }
                const ytResult = {
                    status: res.data.status,
                    videoId: res.data.vid,
                    title: res.data.title,
                    channel: res.data.a,
                    duration: secondToFormatClock(res.data.t),
                    thumbnail: '',
                    detailMp3: {
                        size: res.data.links.mp3.mp3128.size,
                        quality: res.data.links.mp3.mp3128.q,
                        url: ''
                    },
                    detailMp4: {
                        size: mp4Result.size,
                        quality: mp4Result.q,
                        url: '',
                    },
                    provider: 'yt1s.com'
                }
                try {
                    const thumb = await ytdlcore.getInfo(url)
                    ytResult.thumbnail = thumb.player_response.microformat.playerMicroformatRenderer.thumbnail.thumbnails[0].url
                    const resultMp3 = await axios.post('https://yt1s.com/api/ajaxConvert/convert', qs.stringify(formMp3128Kbps))
                    ytResult.detailMp3.url = resultMp3.data.dlink
                    const resultMp4 = await axios.post('https://yt1s.com/api/ajaxConvert/convert', qs.stringify(formMp4720p))
                    ytResult.detailMp4.url = resultMp4.data.dlink
                    resolve(ytResult)
                } catch (err) {
                    reject(err)
                }
            })
            .catch(err => reject(err))
    });
}

/**
 * 
 * @param {String} query 
 * @returns 
 */
async function pinterest(query) {
    return new Promise(async (resolve, reject) => {
        axios.get('https://id.pinterest.com/search/pins/?autologin=true&q=' + query, {
            headers: {
                "cookie": "_auth=1; _b=\"AVna7S1p7l1C5I9u0+nR3YzijpvXOPc6d09SyCzO+DcwpersQH36SmGiYfymBKhZcGg=\"; _pinterest_sess=TWc9PSZHamJOZ0JobUFiSEpSN3Z4a2NsMk9wZ3gxL1NSc2k2NkFLaUw5bVY5cXR5alZHR0gxY2h2MVZDZlNQalNpUUJFRVR5L3NlYy9JZkthekp3bHo5bXFuaFZzVHJFMnkrR3lTbm56U3YvQXBBTW96VUgzVUhuK1Z4VURGKzczUi9hNHdDeTJ5Y2pBTmxhc2owZ2hkSGlDemtUSnYvVXh5dDNkaDN3TjZCTk8ycTdHRHVsOFg2b2NQWCtpOWxqeDNjNkk3cS85MkhhSklSb0hwTnZvZVFyZmJEUllwbG9UVnpCYVNTRzZxOXNJcmduOVc4aURtM3NtRFo3STlmWjJvSjlWTU5ITzg0VUg1NGhOTEZzME9SNFNhVWJRWjRJK3pGMFA4Q3UvcHBnWHdaYXZpa2FUNkx6Z3RNQjEzTFJEOHZoaHRvazc1c1UrYlRuUmdKcDg3ZEY4cjNtZlBLRTRBZjNYK0lPTXZJTzQ5dU8ybDdVS015bWJKT0tjTWYyRlBzclpiamdsNmtpeUZnRjlwVGJXUmdOMXdTUkFHRWloVjBMR0JlTE5YcmhxVHdoNzFHbDZ0YmFHZ1VLQXU1QnpkM1FqUTNMTnhYb3VKeDVGbnhNSkdkNXFSMXQybjRGL3pyZXRLR0ZTc0xHZ0JvbTJCNnAzQzE0cW1WTndIK0trY05HV1gxS09NRktadnFCSDR2YzBoWmRiUGZiWXFQNjcwWmZhaDZQRm1UbzNxc21pV1p5WDlabm1UWGQzanc1SGlrZXB1bDVDWXQvUis3elN2SVFDbm1DSVE5Z0d4YW1sa2hsSkZJb1h0MTFpck5BdDR0d0lZOW1Pa2RDVzNySWpXWmUwOUFhQmFSVUpaOFQ3WlhOQldNMkExeDIvMjZHeXdnNjdMYWdiQUhUSEFBUlhUVTdBMThRRmh1ekJMYWZ2YTJkNlg0cmFCdnU2WEpwcXlPOVZYcGNhNkZDd051S3lGZmo0eHV0ZE42NW8xRm5aRWpoQnNKNnNlSGFad1MzOHNkdWtER0xQTFN5Z3lmRERsZnZWWE5CZEJneVRlMDd2VmNPMjloK0g5eCswZUVJTS9CRkFweHc5RUh6K1JocGN6clc1JmZtL3JhRE1sc0NMTFlpMVErRGtPcllvTGdldz0=; _ir=0"
            }
        }).then(({ data }) => {
            const $ = cheerio.load(data)
            const result = [];
            const hasil = [];
            $('div > a').get().map(b => {
                const link = $(b).find('img').attr('src')
                result.push(link)
            });
            result.forEach(v => {
                if (v == undefined) return
                hasil.push(v.replace(/236/g, '736'))
            })
            hasil.shift();
            resolve(hasil)
        }).catch(err => reject(err));
    })
}



// function tiktokDownloader(url) {
// 	return new Promise((resolve, reject) => {
// 		axios.request({
// 			url: `https://tiktokdownloader.one/api/v1/fetch?url=${url}`,
// 			method: 'GET',
// 			headers: {
// 				"accept": "application/json, text/plain, */*",
// 				"accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
// 				"token": '0121C3C6-5DF8-4BB0-9BDD-9AD9F9CB6396',
// 				"User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1"
// 			}
// 		})
// 			.then(result => {
// 				console.log(result);
// 				let res = {}
// 				res.Author = 'Staz-Yu',
// 					res.status = 200,
// 					res.result = result.data
// 				resolve(res)
// 			})
// 			.catch(err => reject(err))
// 	});
// }

// function tiktokDl(url) {
//     return new Promise(async (resolve, reject) => {
//         const urlTik = await fetch(url).then(res => res.url).catch(err => undefined)
//         if (urlTik === undefined) return reject(new Error('Link tidak valid!'))
//         axios({
//             url: `https://api.snaptik.site/video-key?video_url=${urlTik}`,
//             method: 'GET',
//             headers: {
//                 accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
//                 'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
//             }
//         })
//             .then(({ data }) => {
//                 if (data.status !== 'success') throw new Error('Gagal Mendapatkan key')
//                 console.log(data);
//                 axios({
//                     url: `https://api.snaptik.site/video-details-by-key?key=${data.data.key}`,
//                     method: 'GET',
//                     headers: {
//                         accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
//                         'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Mobile Safari/537.36'
//                     }
//                 })
//                     .then(res => {
//                         const result = {
//                             status: res.data.status,
//                             author: res.data.data.author,
//                             description: res.data.data.description,
//                             video: {
//                                 with_wm: `https://api.snaptik.site/download?key=${res.data.data.video.with_watermark}&type=video`,
//                                 no_wm: `https://api.snaptik.site/download?key=${res.data.data.video.no_watermark}&type=video`,
//                                 no_watermark_raw: res.data.data.video.no_watermark_raw,
//                             },
//                             music: `https://api.snaptik.site/download?key=${res.data.data.music}&type=music`
//                         }
//                         resolve(result);
//                     })
//                     .catch(err => reject(err))
//             })
//             .catch(err => reject(err))
//     });
// }

function tiktokDl(url) {
    return new Promise(async (resolve, reject) => {
        try {
            url = (await fetch(url)).url
            const regTik = /(?:http(?:s|):\/\/|)(?:www\.|)tiktok.com\/([@. -_ 0-9 A-Z a-z]{1,35})\/([a-z]{5,10})\/([0-9]{10,25})/gi.exec(url);
            if (regTik[1] === null) reject(new Error('Ada masalah di link!'));
            const urlTik = `https://www.tiktok.com/node/share/video/${regTik[1]}/${regTik[3]}`;
            const { data } = await axios.get(urlTik, {
                headers: {
                    'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Mobile Safari/537.36',
                    accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'
                }
            });
            axios.get('https://tikdown.org/id', {
                headers: {
                    cookie: 'XSRF-TOKEN=eyJpdiI6ImVNVVJtcHVwcGJJWnM3L1hTVnJZWmc9PSIsInZhbHVlIjoiM2p2T29TMGRKSlE0VGxkZFpPZ0RPZE43QncvYThONWlCYnppSDNBQXlWMlNoMk42N1VkTGwzQkNTNGZjM3h0Z09YOUV6eDloY2dGaC92aTdqczNLMzdwWjVobjA0NVU5aXlwbUpNL1NVbm1XNVhEUzUyL3VjMzRJWnZ6Z28rZHEiLCJtYWMiOiIyYTk2YTkxZGY5MjhmZDZmYTczNmIyOWJiZmY3MTZjNjJiNTBlOTZkNzRiNjI4OGJjNjQ0Y2E3ZDAwZGRmMGExIn0%3D; laravel_session=eyJpdiI6IkNjMDE0ZzNLSXR3UlFLZDMreTdueUE9PSIsInZhbHVlIjoiN0poS1hiUTBrdzQ2WGhIMkFlQmdPVWt6a3hsRUVvTzBFWHBVY3didXB5Uit6akVEY3ZtMnlqY1JkWUZBT0RRV09vUHRpMndjZFJISVRnY2NyajN2dWRETk1wcWljSHlmRS9pRWV1Z3l1alBuT3NhUzRnL2V0aVFFVmVGcUZyWlQiLCJtYWMiOiI1ODhjMWQ5YjY1YzQ2MTM4Zjg1ZWQ0OTUzN2QwODc0NGYxYjY1NWNiMjRlNTc2ODY1YzhiOWUwOWU3MDA0MDZhIn0%3D',
                    referer: 'https://tikdown.org/id',
                    'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Mobile Safari/537.36',
                    accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'
                },
            })
                .then((res) => {
                    const $ = cheerio.load(res.data);
                    const token = $('input[name="_token"]').attr('value');
                    axios.get(`https://tikdown.org/getAjax?url=https://www.tiktok.com/${regTik[1]}/video/${regTik[3]}&_token=${token}`, {
                        headers: {
                            cookie: 'XSRF-TOKEN=eyJpdiI6ImVNVVJtcHVwcGJJWnM3L1hTVnJZWmc9PSIsInZhbHVlIjoiM2p2T29TMGRKSlE0VGxkZFpPZ0RPZE43QncvYThONWlCYnppSDNBQXlWMlNoMk42N1VkTGwzQkNTNGZjM3h0Z09YOUV6eDloY2dGaC92aTdqczNLMzdwWjVobjA0NVU5aXlwbUpNL1NVbm1XNVhEUzUyL3VjMzRJWnZ6Z28rZHEiLCJtYWMiOiIyYTk2YTkxZGY5MjhmZDZmYTczNmIyOWJiZmY3MTZjNjJiNTBlOTZkNzRiNjI4OGJjNjQ0Y2E3ZDAwZGRmMGExIn0%3D; laravel_session=eyJpdiI6IkNjMDE0ZzNLSXR3UlFLZDMreTdueUE9PSIsInZhbHVlIjoiN0poS1hiUTBrdzQ2WGhIMkFlQmdPVWt6a3hsRUVvTzBFWHBVY3didXB5Uit6akVEY3ZtMnlqY1JkWUZBT0RRV09vUHRpMndjZFJISVRnY2NyajN2dWRETk1wcWljSHlmRS9pRWV1Z3l1alBuT3NhUzRnL2V0aVFFVmVGcUZyWlQiLCJtYWMiOiI1ODhjMWQ5YjY1YzQ2MTM4Zjg1ZWQ0OTUzN2QwODc0NGYxYjY1NWNiMjRlNTc2ODY1YzhiOWUwOWU3MDA0MDZhIn0%3D',
                            referer: 'https://tikdown.org/id',
                            'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Mobile Safari/537.36',
                            accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                            'content-type': 'text/html; charset=UTF-8'
                        }
                    })
                        .then((res) => {
                            const $ = cheerio.load(res.data.html)
                            const result = {
                                info: {
                                    nickname: data.itemInfo.itemStruct.author.nickname,
                                    username: '@' + data.itemInfo.itemStruct.author.uniqueId,
                                    desc: data.itemInfo.itemStruct.desc,
                                    created: new Date(data.itemInfo.itemStruct.createTime * 1000).toLocaleDateString('id'),
                                    image: $('img').attr('src'),
                                },
                                media: {
                                    wm: data.itemInfo.itemStruct.video.downloadAddr,
                                    nowm: null,
                                    music: data.itemInfo.itemStruct.music.playUrl,
                                    music2: null
                                },
                            }
                            $('div.download-links').find('a').each((i, e) => {
                                if ($(e).attr('href').endsWith('mp4')) {
                                    result.media.nowm = $(e).attr('href');
                                } else {
                                    result.media.music2 = $(e).attr('href');
                                }
                            })
                            resolve(result);
                        }).catch((err) => {
                            reject(err);
                        });
                }).catch((err) => {
                    reject(err);
                });
        } catch (err) {
            reject(err);
        }
    })
}

/**
 * It takes a URL, and returns a Promise that resolves to an object containing the image URL and the
 * download links
 * @param url - The URL of the Instagram post you want to download.
 * @returns an object with two properties: image and link.
 */
function igDownloader(url) {
    return new Promise((resolve, reject) => {
        const arrayLink = {
            image: null,
            link: []
        }
        const config = {
            data: {
                url,
                action: 'post'
            },
            headers: {
                'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary4E7p8KtS8HAgaqnq',
                'cookie': 'PHPSESSID=q8b960g6t7b62pip8dompq1k4q',
                'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Mobile Safari/537.36',
            }
        }
        axios.post('https://snapinsta.app/action.php', qs.stringify(config.data), config.headers)
            .then(({ data }) => {
                const result = new NodeVM({
                    'compiler': 'javascript',
                    'console': 'inherit',
                }).run(/<script>(.*)<\/script>/g.exec(data)?.[1].replace('eval', '').replace(/\(function(.)?\(h/gi, 'module.exports = (function (h')).split(/innerHTML = \"/)[1].split(/"\; parent/)[0].replace(/\\/g, '');
                const $ = cheerio.load(result);
                $('div.download-items').each((a, b) => {
                    if ($(b).find('a').attr('href').includes('dl.php')) {
                        arrayLink.link.push('https://snapinsta.app' + $(b).find('a').attr('href'))
                    } else {
                        arrayLink.link.push($(b).find('a').attr('href'))
                    }
                })
                const image = $('img').attr('src');
                arrayLink.image = 'https://snapinsta.app' + image;
                resolve(arrayLink);
            }).catch((err) => {
                reject(err);
            });
    });
}

const fbDownloader = async (url) => {
    return new Promise((resolve, reject) => {
        axios.get('https://fdownloader.net/id', {
            headers: {
                accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                cookie: '.AspNetCore.Antiforgery.xskahbNOLhA=CfDJ8AyBv3EaZnFHivhSKLY2g5NwEmiJsmwg942PDSrP2bunDbZ2JspA4eZ5wYi4cp3AShfTFgVAhbWLWSPyFklwGy_6ni1YP0UAKQQ7VBgppW105cd0as4ixOTwKzGqzWl3XJxdW5CfqXqC-VdcWiBeR8I',
                'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Mobile Safari/537.36'
            }
        }).then((res) => {
            const $ = cheerio.load(res.data);
            const token = $('input[name="__RequestVerificationToken"]').attr('value');
            const config = {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    cookie: '.AspNetCore.Antiforgery.xskahbNOLhA=CfDJ8AyBv3EaZnFHivhSKLY2g5NwEmiJsmwg942PDSrP2bunDbZ2JspA4eZ5wYi4cp3AShfTFgVAhbWLWSPyFklwGy_6ni1YP0UAKQQ7VBgppW105cd0as4ixOTwKzGqzWl3XJxdW5CfqXqC-VdcWiBeR8I',
                    'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Mobile Safari/537.36'
                },
                data: {
                    __RequestVerificationToken: token,
                    q: url
                }
            }
            axios.post('https://fdownloader.net/api/ajaxSearch', qs.stringify(config.data), { headers: config.headers })
                .then((res) => {
                    let result = {
                        hd: null,
                        sd: null,
                        duration: null,
                    }
                    if (res.data.status !== 'ok') return new Error('Gagal mendapatkan link!!')
                    const $$ = cheerio.load(res.data.data);
                    result.hd = $$('#fbdownloader > div.tab-wrap > div:nth-child(5) > table > tbody > tr:nth-child(1) > td:nth-child(3) > a').attr('href');
                    result.sd = $$('#fbdownloader > div.tab-wrap > div:nth-child(5) > table > tbody > tr:nth-child(2) > td:nth-child(3) > a').attr('href');
                    result.duration = $$('#search-result > div.detail > div.thumbnail > div.content > div').find('p').text();
                    resolve(result);
                }).catch((err) => {
                    reject(err);
                });
        }).catch((err) => {
            reject(err);
        });
    })
}

const igStalk = (username) => {
    return new Promise((resolve, reject) => {
        if (String(username).startsWith('@')) {
            username = username.slice(1);
        }
        axios.get(`https://www.instagram.com/jakarta.keras/?__a=1`)
            .then(({ data }) => {
                const ig = data.graphql.user;
                const resultIG = {
                    username: '@' + ig.username,
                    full_name: ig.full_name,
                    biography: ig.biography,
                    followers: ig.edge_followed_by.count,
                    following: ig.edge_follow.count,
                    is_private: ig.is_private,
                    is_verified: ig.is_verified,
                    country_block: ig.country_block,
                    external_url: ig.external_url,
                    profile_pic_url: ig.profile_pic_url,
                    profile_pic_url_hd: ig.profile_pic_url_hd
                }
                resolve(resultIG);
            }).catch((err) => {
                reject(err);
            });
    })
}

// function ytdDownload(url) {
// 	return new Promise((resolve, reject) => {
// 		axios.request({
// 			url: 'https://aiovideodl.ml/',
// 			method: 'GET',
// 			headers: {
// 				"accept": 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
// 				"cookie": 'pll_language=en; PHPSESSID=65e21fe835973041fd6a2eb8ebc65635',
// 				"user-agent": 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
// 			}
// 		}).then(({ data }) => {
// 			const $ = cheerio.load(data);
// 			const token = $('#token').attr('value')
// 			let results = {}
// 			let config = {
// 				headers: {
// 					"content-type": 'application/x-www-form-urlencoded',
// 					"cookie": 'pll_language=en; PHPSESSID=65e21fe835973041fd6a2eb8ebc65635',
// 					"user-agent": 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
// 				},
// 				data: {
// 					"url": url,
// 					"action": 'post',
// 					"token": token
// 				}
// 			}
// 			axios.post('https://aiovideodl.ml/wp-json/aio-dl/video-data/', qs.stringify(config.data), { headers: config.headers })
// 				.then((result) => {
// 					results = {
// 						urlOri: result.data.url,
// 						title: result.data.title,
// 						thumbnail: result.data.thumbnail,
// 						duration: result.data.duration,
// 						source: result.data.source,
// 						medias: []
// 					}
// 					for (let i = 0; i < result.data.medias.length; i++) {
// 						if (result.data.medias[i].audioAvailable === true) {
// 							(results.medias.push(result.data.medias[i]))
// 						}
// 					}
// 					resolve(results)
// 				}).catch((err) => {
// 					reject(err)
// 				});
// 		})
// 	});
// }

module.exports = {
    facebook: fbDownloader,
    instagram: downloader,
    instagram2: igDownloader,
    igStalk,
    tiktok: downloader,
    tiktokDl: tiktokDl,
    kwai: downloader,
    like: downloader,
    linkedIn: downloader,
    pinterest: downloader,
    pinterestSearch: pinterest,
    soundCloud: downloader,
    twitch: downloader,
    twitter: downloader,
    youtube: ytdDownload
}