const { unlinkSync } = require("fs-extra");
const { sendText, downloadMediaWa, sendImage, sendVideo, sendSticker, sendAudio, sendDocument, reply } = require("../../functions");
const { mess } = require("../../help");

module.exports = {
    name: "Hidetag in group",
    command: ['hidetag', 'h', 'totag', 'ttg'],
    category: 'group',
    isGroupAdmin: true,
    description: `➾ prefix.hidetag/h [Tag all hide]
    - Format : prefix.hidetag/h <Text yang mau dijadikan hidetag>
    - Contoh : prefix.hidetag Halo Gaess
➾ prefix.totag [jadikan text, image atau lainnya menjadi hidetag]
    - Format : prefix.totag <Tag text, image atau lainnya untuk jadikan hidetag>`,
    async execute(msg, conn) {
        const { args, chat, command, groupMembers, from, isImage, isVideo, isGroup, isQuotedImage, isQuotedVideo, isQuotedSticker, isQuotedAudio, isQuotedDocument, quotedInfo, quotedType } = msg;
        if (isGroup !== true) return await reply(from, mess.info.onlyGroup, chat);
        const groupMem = groupMembers.map(v => {
            return v.id;
        })
        const queryTag = args[0] !== undefined
            ? args.join(' ')
            : quotedInfo?.quotedMessage[quotedType]?.caption;
        if (command === 'totag' || command === 'ttg') {
            if (isImage || isQuotedImage) {
                const { path, buffer } = await downloadMediaWa(msg);
                await sendImage(from, buffer, { capt: queryTag, mentions: groupMem });
                unlinkSync(path);
            } else if (isVideo || isQuotedVideo) {
                const { path, buffer } = await downloadMediaWa(msg);
                await sendVideo(from, buffer, { caption: queryTag, mentions: groupMem });
                unlinkSync(path);
            } else if (isQuotedSticker) {
                const { path, buffer } = await downloadMediaWa(msg);
                await sendSticker(from, buffer, { mentions: groupMem });
                unlinkSync(path);
            } else if (isQuotedAudio) {
                const { path, buffer } = await downloadMediaWa(msg);
                await sendAudio(from, buffer, { mentions: groupMem });
                unlinkSync(path);
            } else if (isQuotedDocument) {
                const { path, buffer } = await downloadMediaWa(msg);
                await sendDocument(from, buffer, { mentions: groupMem });
                unlinkSync(path);
            } else {
                await sendText(from, queryTag, { mentions: groupMem });
            }
        } else {
            await sendText(from, queryTag, { mentions: groupMem });
        }
    }
}