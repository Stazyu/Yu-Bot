const Model = require('../database/mongoDBModel');

module.exports = class User extends Model {
    #collection;
    constructor(db) {
        super(db);
        this.#collection = 'users';
    }

    async findOneUser(filterUser = {}) {
        return await this.findOneDocument(this.#collection, filterUser);
    }

    async findAllUser() {
        return await this.findAllDocument(this.#collection);
    }

    async findMultiUser(filterUser = []) {
        return await this.findMultiDocument(this.#collection, filterUser);
    }

    async insertOneUser(detailUser = {}) {
        return await this.insertOneDocument(this.#collection, detailUser);
    }

    async insertMultiUser(detailUser = []) {
        return await this.insertMultiDocument(this.#collection, detailUser);
    }

    async updateOneUser(filterUser = {}, updateUser = {}) {
        return await this.updateOneDocument(this.#collection, filterUser, updateUser);
    }

    async updateMultiUser(filterUser = [], updateUser = []) {
        return await this.updateMultiDocument(this.#collection, filterUser, updateUser);
    }

    async deleteOneUser(filterUser = {}) {
        return await this.deleteOneDocument(this.#collection, filterUser);
    }

    async deleteMultiUser(filterUser = []) {
        return await this.deleteMultiDocument(this.#collection, filterUser);
    }

    async replaceOneUser(filterUser = {}, replaceUser = {}) {
        return await this.replaceOneDocument(this.#collection, filterUser, replaceUser);
    }
}