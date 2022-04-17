// const reg = /([0-9]{13,14})\:([@ a-z .]{15,16})/gi.exec('6283104500832:1@s.whatsapp.net')
// console.log(reg);

// const urltik = 'https://www.tiktok.com/@m.andini29/video/7033322172357610778'
// const regTik = /(?:http(?:s|):\/\/|)(?:www\.|)tiktok.com\/([@. 0-9 A-Z a-z]{5,15})\/([a-z]{5,10})/gi.exec(urltik)
// console.log(regTik);

// const axios = require('axios').default;
// axios.head('https://redirector.googlevideo.com/videoplayback?expire=1643968680&ei=SKT8YdLqM9SK2LYPh9KxqAY&ip=3.87.30.98&id=o-AIgWmMqoJXtNpx65POIDNfPlHvwPXN15fP9fJ_2FcPPB&itag=22&source=youtube&requiressl=yes&mh=D4&mm=31%2C26&mn=sn-p5qlsn7s%2Csn-ab5l6nzr&ms=au%2Conr&mv=m&mvi=2&pl=21&initcwndbps=902500&vprv=1&mime=video%2Fmp4&cnr=14&ratebypass=yes&dur=223.492&lmt=1640172610868192&mt=1643946788&fvip=2&fexp=24001373%2C24007246&c=ANDROID&txp=6311224&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cvprv%2Cmime%2Ccnr%2Cratebypass%2Cdur%2Clmt&sig=AOq0QJ8wRQIhAOrtw9DmcaFZRjagXJCV9284fso2nTMtfjf9w42Rvg9xAiB4-K9KlaFXMEDapVZ2xtBPsDLM2INDODTPvb9tcDI7vQ%3D%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AG3C_xAwRgIhAMn-l6p_GJ8bvlMC3GUybhEpBgVakh4mkK0PZxeHOAhKAiEAr4FAq2jTzL8HBmN_IGXWkVkwJT2wwIf4QgUl6fJrN14%3D&title=Adele+-+Easy+On+Me+%28ROCK+VERSION%29')
//     .then(res => {
//         console.log(res);
//     })
//     .catch(err => console.log(err));

import axios from "axios";
import cheerio from "cheerio";
import fetch from "node-fetch";
import qs from "qs";
import ig from "instatouch";
import scraper from 'node-scrapy';

// axios.get('https://www.instagram.com/p/CZzP4FnP11B/?utm_source=ig_web_copy_link')
//     .then((res) => {
//         console.log(res);
//     }).catch((err) => {
//         console.log(err);
//     });

// const url = 'https://www.instagram.com/p/CY87MsZAeXo/?utm_source=ig_web_copy_link';
// const urltik = 'https://www.tiktok.com/@m.andini29/video/7033322172357610778'
// // const regPost = /(?:http(?:s|):\/\/|)(?:www\.|)instagram.com\/p\/([-_0-9A-Za-z]{5,18})/gi.exec(url)
// const regTik = /(?:http(?:s|):\/\/|)(?:www\.|)tiktok.com\/([@. 0-9 A-Z a-z]{5,15})\/([a-z]{5,10})\/([0-9]{10,25})/gi.exec(urltik)

// console.log(regTik);
// let BaseUrlPost = `https://www.instagram.com/p/`
// axios({
//     // url: BaseUrlPost + regPost[1] + "/?__a=1",
//     url: 'https://www.instagram.com/p/CZzH7YWP6yd/?__a=1',
//     method: "GET",
//     headers: {
//         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
//         'cookie': 'crsftoken=nm20rJm2jFpkXUquLKw0c4qwdEArdPhg; ds_user_id=37572608640; ig_did=54AA06C9-3A86-4F53-A7F6-C9127DC153AC; ig_nrcb=1; mid=YU0dFwALAAHPggeAvlvEiV8DP9zM; sessionid=37572608640%3AdLIYIrAwso2GpN%3A8;'
//     }
// })
//     .then((res) => {
//         console.log(res);
//         // console.log(JSON.stringify(res.data.graphql.shortcode_media, undefined, 2));
//     }).catch((err) => {
//         console.log(err);
//     });

// var options = {
//     method: 'GET',
//     url: 'https://tiktok-download-video-no-watermark.p.rapidapi.com/tiktok/info',
//     params: { url: 'https://www.tiktok.com/@justinbieber/video/6943631942512315654' },
//     headers: {
//         'x-rapidapi-host': 'tiktok-download-video-no-watermark.p.rapidapi.com',
//         'x-rapidapi-key': '5f2f7a2212msh2a943b8205d5c54p1601edjsn1892b9c4b1d2'
//     }
// };

// axios.request(options).then(function (response) {
//     console.log(response.data);
// }).catch(function (error) {
//     console.error(error);
// });

// axios.get('https://id.pinterest.com/2ecb5b34-925c-4728-8e67-8c71ff3d38f2')
//     .then(res => console.log(res))
//     .catch(err => console.log(err));

// const linkWA = 'https://chat.whatsapp.com/EpORycw6ahzJBPxUHpCmzu'
// const reg = /(?:http(?:s|):\/\/|)chat.whatsapp.com\/([-_0-9A-Za-z]{10,25})/gi.exec(linkWA);
// console.log(reg[1]);

// const FormData = require('form-data');
// const form = new FormData();
// form.append('file',)

// axios({
//     url: 'https://telegra.ph/upload',
//     method: 'post',
//     headers: {

//     }
// })

// /**
//  * It takes a TikTok URL and returns a JSON object containing the video URL, the music URL, and the
//  * author's nickname
//  * @param url - The URL of the TikTok video you want to download.
//  */
// const tiktokDl = async (url) => {
//     url = (await fetch(url)).url
//     const regTik = /(?:http(?:s|):\/\/|)(?:www\.|)tiktok.com\/([@. -_ 0-9 A-Z a-z]{5,15})\/([a-z]{5,10})\/([0-9]{10,25})/gi.exec(url)
//     const urlTik = `https://www.tiktok.com/node/share/video/${regTik[1]}/${regTik[3]}`
//     const { data } = await axios.get(urlTik, {
//         headers: {
//             'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Mobile Safari/537.36',
//             accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'
//         }
//     });
//     axios.get('https://tikdown.org/id', {
//         headers: {
//             cookie: 'XSRF-TOKEN=eyJpdiI6ImVNVVJtcHVwcGJJWnM3L1hTVnJZWmc9PSIsInZhbHVlIjoiM2p2T29TMGRKSlE0VGxkZFpPZ0RPZE43QncvYThONWlCYnppSDNBQXlWMlNoMk42N1VkTGwzQkNTNGZjM3h0Z09YOUV6eDloY2dGaC92aTdqczNLMzdwWjVobjA0NVU5aXlwbUpNL1NVbm1XNVhEUzUyL3VjMzRJWnZ6Z28rZHEiLCJtYWMiOiIyYTk2YTkxZGY5MjhmZDZmYTczNmIyOWJiZmY3MTZjNjJiNTBlOTZkNzRiNjI4OGJjNjQ0Y2E3ZDAwZGRmMGExIn0%3D; laravel_session=eyJpdiI6IkNjMDE0ZzNLSXR3UlFLZDMreTdueUE9PSIsInZhbHVlIjoiN0poS1hiUTBrdzQ2WGhIMkFlQmdPVWt6a3hsRUVvTzBFWHBVY3didXB5Uit6akVEY3ZtMnlqY1JkWUZBT0RRV09vUHRpMndjZFJISVRnY2NyajN2dWRETk1wcWljSHlmRS9pRWV1Z3l1alBuT3NhUzRnL2V0aVFFVmVGcUZyWlQiLCJtYWMiOiI1ODhjMWQ5YjY1YzQ2MTM4Zjg1ZWQ0OTUzN2QwODc0NGYxYjY1NWNiMjRlNTc2ODY1YzhiOWUwOWU3MDA0MDZhIn0%3D',
//             referer: 'https://tikdown.org/id',
//             'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Mobile Safari/537.36',
//             accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'
//         },
//     })
//         .then((res) => {
//             const $ = cheerio.load(res.data);
//             const token = $('input[name="_token"]').attr('value');
//             axios.get(`https://tikdown.org/getAjax?url=https://www.tiktok.com/${regTik[1]}/video/${regTik[3]}&_token=${token}`, {
//                 headers: {
//                     cookie: 'XSRF-TOKEN=eyJpdiI6ImVNVVJtcHVwcGJJWnM3L1hTVnJZWmc9PSIsInZhbHVlIjoiM2p2T29TMGRKSlE0VGxkZFpPZ0RPZE43QncvYThONWlCYnppSDNBQXlWMlNoMk42N1VkTGwzQkNTNGZjM3h0Z09YOUV6eDloY2dGaC92aTdqczNLMzdwWjVobjA0NVU5aXlwbUpNL1NVbm1XNVhEUzUyL3VjMzRJWnZ6Z28rZHEiLCJtYWMiOiIyYTk2YTkxZGY5MjhmZDZmYTczNmIyOWJiZmY3MTZjNjJiNTBlOTZkNzRiNjI4OGJjNjQ0Y2E3ZDAwZGRmMGExIn0%3D; laravel_session=eyJpdiI6IkNjMDE0ZzNLSXR3UlFLZDMreTdueUE9PSIsInZhbHVlIjoiN0poS1hiUTBrdzQ2WGhIMkFlQmdPVWt6a3hsRUVvTzBFWHBVY3didXB5Uit6akVEY3ZtMnlqY1JkWUZBT0RRV09vUHRpMndjZFJISVRnY2NyajN2dWRETk1wcWljSHlmRS9pRWV1Z3l1alBuT3NhUzRnL2V0aVFFVmVGcUZyWlQiLCJtYWMiOiI1ODhjMWQ5YjY1YzQ2MTM4Zjg1ZWQ0OTUzN2QwODc0NGYxYjY1NWNiMjRlNTc2ODY1YzhiOWUwOWU3MDA0MDZhIn0%3D',
//                     referer: 'https://tikdown.org/id',
//                     'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Mobile Safari/537.36',
//                     accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
//                     'content-type': 'text/html; charset=UTF-8'
//                 }
//             })
//                 .then((res) => {
//                     const $ = cheerio.load(res.data.html)
//                     const result = {
//                         info: {
//                             author: data.itemInfo.itemStruct.author.nickname,
//                             desc: data.itemInfo.itemStruct.desc,
//                             created: new Date(data.itemInfo.itemStruct.createTime * 1000).toLocaleDateString('id'),
//                             image: $('img').attr('src'),
//                         },
//                         media: {
//                             wm: data.itemInfo.itemStruct.video.downloadAddr,
//                             nowm: null,
//                             music: data.itemInfo.itemStruct.music.playUrl,
//                             music2: null
//                         },
//                     }
//                     $('div.download-links').find('a').each((i, e) => {
//                         if ($(e).attr('href').endsWith('mp4')) {
//                             result.media.nowm = $(e).attr('href');
//                         } else {
//                             result.media.music2 = $(e).attr('href');
//                         }
//                     })
//                     console.log(result);
//                 }).catch((err) => {
//                     console.log(err);
//                 });
//         }).catch((err) => {
//             console.log(err);
//         });
// }

// tiktokDl('https://vm.tiktok.com/ZSeT9SHJM/');

// const FBDownloader = async (url) => {
//     axios.get('https://fdownloader.net/id', {
//         headers: {
//             accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
//             cookie: '.AspNetCore.Antiforgery.xskahbNOLhA=CfDJ8AyBv3EaZnFHivhSKLY2g5NwEmiJsmwg942PDSrP2bunDbZ2JspA4eZ5wYi4cp3AShfTFgVAhbWLWSPyFklwGy_6ni1YP0UAKQQ7VBgppW105cd0as4ixOTwKzGqzWl3XJxdW5CfqXqC-VdcWiBeR8I',
//             'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Mobile Safari/537.36'
//         }
//     }).then((res) => {
//         // console.log(res.data);
//         const $ = cheerio.load(res.data);
//         const token = $('input[name="__RequestVerificationToken"]').attr('value');
//         const config = {
//             headers: {
//                 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
//                 cookie: '.AspNetCore.Antiforgery.xskahbNOLhA=CfDJ8AyBv3EaZnFHivhSKLY2g5NwEmiJsmwg942PDSrP2bunDbZ2JspA4eZ5wYi4cp3AShfTFgVAhbWLWSPyFklwGy_6ni1YP0UAKQQ7VBgppW105cd0as4ixOTwKzGqzWl3XJxdW5CfqXqC-VdcWiBeR8I',
//                 'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Mobile Safari/537.36'
//             },
//             data: {
//                 __RequestVerificationToken: token,
//                 q: url
//             }
//         }
//         axios.post('https://fdownloader.net/api/ajaxSearch', qs.stringify(config.data), { headers: config.headers })
//             .then((res) => {
//                 let result = {
//                     hd: null,
//                     sd: null,
//                     duration: null,
//                 }
//                 if (res.data.status !== 'ok') return new Error('Gagal mendapatkan link!!')
//                 const $$ = cheerio.load(res.data.data);
//                 result.hd = $$('#fbdownloader > div.tab-wrap > div:nth-child(5) > table > tbody > tr:nth-child(1) > td:nth-child(3) > a').attr('href');
//                 result.sd = $$('#fbdownloader > div.tab-wrap > div:nth-child(5) > table > tbody > tr:nth-child(2) > td:nth-child(3) > a').attr('href');
//                 result.duration = $$('#search-result > div.detail > div.thumbnail > div.content > div').find('p').text();
//                 console.log(result);
//             }).catch((err) => {
//                 console.log(err);
//             });
//     }).catch((err) => {
//         console.log(err);
//     });
// }

// FBDownloader('https://fb.watch/bxPFwkXXYr/')

const igDownloader = (url) => {
    axios.get(url)
        .then((res) => {
            // console.log(res.data);
            const ig = res.data.graphql.shortcode_media;
            let result = {
                info: {
                    id: null,
                    shortcode: null,
                    username: null,
                    full_name: null,
                    like_count: null,
                    profile_url: null,
                },
                media: {
                    caption: null,
                    url: [],
                }
            }
            if (['GraphVideo', 'GraphImage', 'GraphSidecar'].some(v => ig.__typename)) {
                result.info.id = ig.id,
                    result.info.shortcode = ig.shortcode,
                    result.info.username = ig.owner.username,
                    result.info.full_name = ig.owner.full_name,
                    result.info.like_count = ig.edge_media_preview_like.count,
                    result.info.profile_url = ig.owner.profile_pic_url
            }
            if (ig.__typename == 'GraphVideo') {
                result.media.url = ig.video_url;
            } else if (ig.__typename == 'GraphImage') {
                result.media.url = ig.display_url;
            } else if (ig.__typename == 'GraphSidecar') {
                result.media.caption = ig.edge_sidecar_to_children.edges[0].node.accessibility_caption;
                ig.edge_sidecar_to_children.edges.forEach((v) => {
                    if (v.node.__typename == 'GraphImage') {
                        result.media.url.push(v.node.display_url);
                    }
                    if (v.node.__typename == 'GraphVideo') {
                        result.media.url.push(v.node.video_url);
                    }
                })
            }
            console.log(result);
        }).catch((err) => {
            console.log(err);
        });
}

// igDownloader('https://www.instagram.com/p/Car4eDdFNvM/?__a=1')
// igDownloader('https://www.instagram.com/reel/CawcJGhPzSe/?__a=1')
// // igDownloader('https://www.instagram.com/stories/rohman.rodrigo/2786543998239900428/?__a=1')

import { NodeVM } from 'vm2';

// const tes = async () => {
//     const out = new NodeVM({
//         'compiler': 'javascript',
//         'console': 'inherit',
//     }).run(/<script>(.*)<\/script>/g.exec((await axios.post("https://snapinsta.app/action.php?lang=id", new URLSearchParams(Object.entries({
//         url: "https://www.instagram.com/p/CauBZ9RLE4t/?utm_source=ig_web_copy_link",
//         action: "post"
//     })))).data)?.[1].replace('eval', '').replace(/\(function(.)?\(h/gi, 'module.exports = (function (h'))
//     const $ = cheerio.load(out);
//     // $('div.download-items').each(function (a, b) {
//     //     if ($(b).find('a').attr('href').includes('dl.php')) {
//     //         arrayLink.link.push('https://snapinsta.app' + $(b).find('a').attr('href'))
//     //     } else {
//     //         arrayLink.link.push($(b).find('a').attr('href'))
//     //     }
//     // })
//     const tes = $('#div_download > section > div > div > div > div.download-items__btn > a').attr('href')
//     console.log(tes);
// }

// tes()

// function igDownloader2(url) {
//     return new Promise((resolve, reject) => {
//         const arrayLink = {
//             image: null,
//             link: []
//         }
//         const config = {
//             data: {
//                 url,
//                 action: 'post'
//             },
//             headers: {
//                 'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
//                 'cache-control': 'max-age=0',
//                 'content-type': 'application/x-www-form-urlencoded',
//                 'cookie': 'PHPSESSID=lbb0n09kefijm5av79leu921e7',
//                 'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.84 Mobile Safari/537.36',
//             }
//         }
//         axios.post('https://snapinsta.app/action.php', qs.stringify(config.data), config.headers)
//             .then(({ data }) => {
//                 console.log(data);
//                 const result = new NodeVM({
//                     'compiler': 'javascript',
//                     'console': 'inherit',
//                 }).run(/<script>(.*)<\/script>/g.exec(data)?.[1].replace('eval', '').replace(/\(function(.)?\(h/gi, 'module.exports = (function (h')).split(/innerHTML = \"/)[1].split(/"\; parent/)[0].replace(/\\/g, '');
//                 const $ = cheerio.load(result);
//                 $('div.download-items').each((a, b) => {
//                     if ($(b).find('a').attr('href').includes('dl.php')) {
//                         arrayLink.link.push('https://snapinsta.app' + $(b).find('a').attr('href'))
//                     } else {
//                         arrayLink.link.push($(b).find('a').attr('href'))
//                     }
//                 })
//                 const image = $('img').attr('src');
//                 arrayLink.image = 'https://snapinsta.app' + image;
//                 resolve(arrayLink);
//             }).catch((err) => {
//                 reject(err);
//             });
//     });
// }

// igDownloader2('https://www.instagram.com/reel/CamankKlD32/?utm_medium=copy_link')

const kbbi = async () => {
    fetch(`https://kbbi.kemdikbud.go.id/entri/sabar`)
        .then((res) => {
            return res.text()
        }).then((res) => {
            const model = {
                lema: 'h2',
                a: ['i title'],
                arti: ['ol li']
            }
            console.log(scraper.extract(res, model));
        })
        .catch((err) => {
            console.log(err);
        });
}

// kbbi();

// const igStalk = (username) => {
//     return new Promise((resolve, reject) => {
//         if (String(username).startsWith('@')) {
//             username = username.slice(1);
//         }
//         axios.get(`https://www.instagram.com/jakarta.keras/?__a=1`)
//             .then(({ data }) => {
//                 const ig = data.graphql.user;
//                 const resultIG = {
//                     username: '@' + ig.username,
//                     full_name: ig.full_name,
//                     biography: ig.biography,
//                     followers: ig.edge_followed_by.count,
//                     following: ig.edge_follow.count,
//                     is_private: ig.is_private,
//                     is_verified: ig.is_verified,
//                     country_block: ig.country_block,
//                     external_url: ig.external_url,
//                     profile_pic_url: ig.profile_pic_url,
//                     profile_pic_url_hd: ig.profile_pic_url_hd
//                 }
//                 resolve(resultIG);
//             }).catch((err) => {
//                 reject(err);
//             });
//     })
// }

// igStalk('@jakarta.keras')
//     .then(res => console.log(res))

const randomMeme = (usernameIg) => {
    if (String(usernameIg).startsWith('@')) {
        usernameIg = usernameIg.slice(1);
    }
    axios.get(`https://www.instagram.com/${usernameIg}/?__a=1`)
        .then(({ data }) => {
            const rm = data.graphql.user;
            const edges = rm.edge_owner_to_timeline_media.edges
            console.log(edges.length);
        }).catch((err) => {
            console.log(err);
        });
}

// randomMeme('memecomic.id');

const instagram2 = (url) => {
    return new Promise((resolve, reject) => {
        const result = [];
        const config = {
            header: {
                accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'content-length': 89,
                'content-type': 'application/x-www-form-urlencoded',
                origin: 'https://downloadgram.org',
                'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.84 Mobile Safari/537.36'
            },
            data: {
                url: url,
                submit: ''
            }
        }
        axios.post('https://downloadgram.org/', new URLSearchParams(Object.entries(config.data)), config.header)
            .then((res) => {
                const { data } = res;
                const $ = cheerio.load(data);
                $('#downloadBox').find('a').each((i, e) => {
                    result.push({ url: $(e).attr('href') });
                })
                console.log(result);
                resolve(result);
            }).catch((err) => {
                reject(err);
            });
    })
}

instagram2('https://www.instagram.com/p/CbuepttN0Oi/?utm_source=ig_web_copy_link')