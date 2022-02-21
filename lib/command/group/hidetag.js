const { unlinkSync } = require("fs-extra");
const { sendText, downloadMediaWa, sendImage, sendVideo, sendSticker, sendAudio, sendDocument } = require("../../functions");

module.exports = {
    name: "Hidetag in group",
    command: ['hidetag', 'h', 'totag', 'ttg'],
    category: 'group',
    isGroupAdmin: true,
    description: '',
    async execute(msg, conn) {
        const { args, command, groupMembers, from, isImage, isVideo, isMedia, isQuotedImage, isQuotedVideo, isQuotedSticker, isQuotedAudio, isQuotedDocument, quotedInfo, quotedType } = msg;
        const groupMem = groupMembers.map(v => {
            return v.id;
        })
        const queryTag = args[0] !== undefined
            ? args.join(' ')
            : quotedInfo.quotedMessage.conversation !== ''
                ? quotedInfo.quotedMessage.conversation
                : quotedInfo.quotedMessage[quotedType] !== undefined
                    ? quotedInfo.quotedMessage[quotedType].caption
                    : null;
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