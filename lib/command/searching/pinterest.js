const { randomInteger } = require("../../../helpers/generate");
const { pinterestSearch } = require("../../../utils/downloader");
const { sendImage, reply } = require("../../functions");
const { mess } = require("../../help");


module.exports = {
    name: "searching image pinterest",
    command: ['pinterest'],
    category: 'searching',
    description: '',
    async execute(msg, conn) {
        const { chat, far, from, } = msg;
        pinterestSearch(far)
            .then(async (res) => {
                const indexImage = randomInteger(0, 22);
                await sendImage(from, res[indexImage], { capt: 'Nih kak..', msg: chat });
            }).catch((err) => {
                console.log(err);
                reply(from, mess.error.link, chat)
            });
    }
}