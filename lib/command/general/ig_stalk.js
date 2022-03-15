const { igStalk } = require("../../../utils/downloader");
const { sendImage, reply } = require("../../functions");
const { mess } = require("../../help");


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
            const resultIg = await igStalk(userName);
            const capt = `*『 Instagram Stalking 』*\n
*➨ Bio :* ${resultIg.biography}\n
*➨ Username :* ${resultIg.username}
*➨ Fullname :* ${resultIg.full_name}
*➨ Followers :* ${resultIg.followers}
*➨ Following :* ${resultIg.following}
*➨ country_block :* ${resultIg.country_block ? '✅' : '❌'}
*➨ Private :* ${resultIg.is_private ? '✅' : '❌'}
*➨ Verified :* ${resultIg.is_verified ? '✅' : '❌'}
`
            await sendImage(from, resultIg.profile_pic_url_hd, { capt, msg: chat })
        } catch (err) {
            reply(from, mess.error.link, chat)
            console.log(err);
        }
    }
}