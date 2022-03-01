const Group = require("./group");

module.exports = class DatabaseBot extends Group {
    constructor(db = 'Whatsapp-Bot-MD') {
        super(db);
    }

    async findSettingBot() {
        const result = await this.findOneDocument('settings', { type: 'bot_setting' });
        return result;
    }

    async updateSettingBot(updateSetting = {}) {
        const result = await this.updateOneDocument('settings', { type: 'bot_setting' }, updateSetting);
        return result;
    }

    async insertSettingBot(insertSetting = {}) {
        const result = await this.insertOneDocument('settings', insertSetting);
        return result;
    }

    async deleteSettingBot(deleteSetting = {}) {
        const result = await this.updateOneDocument('settings', { type: 'bot_setting' }, { $pull: deleteSetting });
        return result;
    }
}