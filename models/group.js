const User = require('./user');

module.exports = class Group extends User {
    #collection;
    constructor(db) {
        super(db);
        this.#collection = 'groups';
    }

    async findAllGroup() {
        return await this.findA(this.#collection);
    }

    async findOneGroup(filterGroup = {}) {
        return await this.findOneDocument(this.#collection, filterGroup);
    }

    async findMultiGroup(filterGroup = []) {
        return await this.findMultiDocument(this.#collection, filterGroup);
    }

    async insertOneGroup(detailGroup = {}) {
        return await this.insertOneDocument(this.#collection, detailGroup);
    }

    async insertMultiGroup(detailGroup = []) {
        return await this.insertMultiDocument(this.#collection, detailGroup);
    }

    async updateOneGroup(filterGroup = {}, updateGroup = {}) {
        return await this.updateOneDocument(this.#collection, filterGroup, updateGroup);
    }

    async updateMultiGroup(filterGroup = [], updateGroup = {}) {
        return await this.updateMultiDocument(this.#collection, filterGroup, updateGroup);
    }

    async deleteOneGroup(filterGroup = {}) {
        return await this.deleteOneDocument(this.#collection, filterGroup);
    }

    async deleteMultiGroup(filterGroup = []) {
        return await this.deleteMultiDocument(this.#collection, filterGroup);
    }

    async replaceOneGroup(filterGroup = {}, replaceGroup = {}) {
        return await this.replaceOneDocument(this.#collection, filterGroup, replaceGroup);
    }
}