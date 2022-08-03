const { igApi } = require('insta-fetcher');

const { sendImage, reply } = require("../../functions");
const { mess } = require("../../help");

const ig = new igApi(process.env.IG_SESSIONID);

module.exports = {
    name: 'IG Stalking',
    command: ['igstalk'],
    category: 'general',
    description: `➾ prefix.igstalk [Stalking Instagram]
    - Format : prefix.igstalk <Username Instagram>
    - Contoh : prefix.igstalk wahyuhp57`,
    async execute(msg, conn) {
        const { chat, far, from } = msg;
        const userName = far
        try {
            const resultIg = await ig.fetchUser(userName);
            const capt = `*『 Instagram Stalking 』*\n
*➨ Username :* ${resultIg.username}
*➨ Fullname :* ${resultIg.fullname}
*➨ Followers :* ${resultIg.followers}
*➨ Following :* ${resultIg.following}
*➨ Private :* ${resultIg.is_private ? '✅' : '❌'}
*➨ Verified :* ${resultIg.is_verified ? '✅' : '❌'}\n
*➨ Bio :* ${resultIg.biography}
`
            await sendImage(from, resultIg.hd_profile_pic_url_info.url, { capt, msg: chat })
        } catch (err) {
            reply(from, mess.error.link, chat)
            console.log(err);
        }
    }
}