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

// axios.get('https://www.instagram.com/p/CZzP4FnP11B/?utm_source=ig_web_copy_link')
//     .then((res) => {
//         console.log(res);
//     }).catch((err) => {
//         console.log(err);
//     });

// const url = 'https://www.instagram.com/p/CY87MsZAeXo/?utm_source=ig_web_copy_link';
// const urltik = 'https://www.tiktok.com/@m.andini29/video/7033322172357610778'
// const regPost = /(?:http(?:s|):\/\/|)(?:www\.|)instagram.com\/p\/([-_0-9A-Za-z]{5,18})/gi.exec(url)
// const regTik = /(?:http(?:s|):\/\/|)(?:www\.|)tiktok.com\/([@. 0-9 A-Z a-z]{5,15})\/([a-z]{5,10})/gi.exec(urltik)

// // console.log(regPost);
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