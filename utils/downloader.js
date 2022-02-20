const cheerio = require('cheerio')
const { default: axios } = require('axios')
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const ytdlcore = require('ytdl-core')
const qs = require('qs')

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
                    return i.q === '720p' ? i.q === '720p' : i.q === '480p'
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

function tiktokDl(url) {
    return new Promise(async (resolve, reject) => {
        const urlTik = await fetch(url).then(res => res.url).catch(err => undefined)
        if (urlTik === undefined) return reject(new Error('Link tidak valid!'))
        axios({
            url: `https://api.snaptik.site/video-key?video_url=${urlTik}`,
            method: 'GET',
            headers: {
                accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
            }
        })
            .then(({ data }) => {
                if (data.status !== 'success') throw new Error('Gagal Mendapatkan key')
                console.log(data);
                axios({
                    url: `https://api.snaptik.site/video-details-by-key?key=${data.data.key}`,
                    method: 'GET',
                    headers: {
                        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                        'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Mobile Safari/537.36'
                    }
                })
                    .then(res => {
                        const result = {
                            status: res.data.status,
                            author: res.data.data.author,
                            description: res.data.data.description,
                            video: {
                                with_wm: `https://api.snaptik.site/download?key=${res.data.data.video.with_watermark}&type=video`,
                                no_wm: `https://api.snaptik.site/download?key=${res.data.data.video.no_watermark}&type=video`,
                                no_watermark_raw: res.data.data.video.no_watermark_raw,
                            },
                            music: `https://api.snaptik.site/download?key=${res.data.data.music}&type=music`
                        }
                        resolve(result);
                    })
                    .catch(err => reject(err))
            })
            .catch(err => reject(err))
    });
}

function igDownloader(url) {
    return new Promise((resolve, reject) => {
        const arrayLink = {
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
            .then((res) => {
                const $ = cheerio.load(res.data);
                $('div.download-items').each(function (a, b) {
                    if ($(b).find('a').attr('href').includes('dl.php')) {
                        arrayLink.link.push('https://snapinsta.app' + $(b).find('a').attr('href'))
                    } else {
                        arrayLink.link.push($(b).find('a').attr('href'))
                    }
                })
                resolve(arrayLink);
            }).catch((err) => {
                reject(err);
            });
    });
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
    facebook: downloader,
    instagram: downloader,
    instagram2: igDownloader,
    tiktok: downloader,
    tiktokDl: tiktokDl,
    kwai: downloader,
    like: downloader,
    linkedIn: downloader,
    pinterest: downloader,
    soundCloud: downloader,
    twitch: downloader,
    twitter: downloader,
    youtube: ytdDownload
}