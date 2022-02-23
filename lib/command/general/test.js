const { unlinkSync } = require("fs-extra");
const User = require("../../../models/User");
const { upToTele } = require("../../../utils/convert");
const { downloadMediaWa } = require("../../functions");


module.exports = {
    name: "Testing",
    command: ['test', 'tes'],
    isOwner: true,
    description: '',
    async execute(msg, from) {
        const { isImage, isQuotedImage } = msg;
        if (isImage, isQuotedImage) {
            const { path, buffer } = await downloadMediaWa(msg);
            upToTele(buffer)
                .then(res => {
                    console.log(res);
                })
                .catch(err => console.log(err));
            unlinkSync(path);
        }
    }
}