const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

module.exports = class Database {
    constructor(db) {
        this.db = db;
    }

    async findOneDocument(collection, filter = {}) {
        const client = new MongoClient(process.env.MONGO_URL);
        try {
            await client.connect();
            const database = client.db(this.db);
            const coll = database.collection(collection);
            return await coll
                .findOne(filter);
        } catch (err) {
            console.log("Error :", err);
        } finally {
            await client.close();
        }
    }

    async findMultiDocument(collection, filter = []) {
        const client = new MongoClient(process.env.MONGO_URL);
        try {
            await client.connect();
            const database = client.db(this.db);
            const document = database.collection(collection);
            return await document
                .find(filter)
                .toArray();
        } catch (err) {
            console.log("Error :", err);
        } finally {
            await client.close();
        }

    }
    async findAllDocument(collection) {
        const client = new MongoClient(process.env.MONGO_URL);
        try {
            await client.connect();
            const database = client.db(this.db);
            const document = database.collection(collection);
            return await document
                .find()
                .toArray();
        } catch (err) {
            console.log("Error :", err);
        } finally {
            await client.close();
        }
    }

    async insertOneDocument(collection, insertDoc = {}) {
        const client = new MongoClient(process.env.MONGO_URL);
        try {
            await client.connect();
            const database = client.db(this.db);
            const document = database.collection(collection);
            const result = await document.insertOne(insertDoc);
            return result;
        } catch (err) {
            console.log("Error :", err);
        } finally {
            await client.close();
        }
    }

    async insertMultiDocument(collection, insertDoc = []) {
        const client = new MongoClient(process.env.MONGO_URL);
        try {
            await client.connect();
            const database = client.db(this.db);
            const document = database.collection(collection);
            return await document
                .insertMany(insertDoc);
        } catch (err) {
            console.log("Error :", err);
        } finally {
            await client.close();
        }
    }

    /**
     * 
     * @param {String} collection 
     * @param {{}} filter 
     * @param {{}} update 
     * @returns 
     */
    async updateOneDocument(collection, filter = {}, update = {}) {
        const client = new MongoClient(process.env.MONGO_URL);
        try {
            await client.connect();
            const database = client.db(this.db);
            const document = database.collection(collection);
            return await document
                .updateOne(filter, { $set: update }, { upsert: true });
        } catch (err) {
            console.log("Error :", err);
        } finally {
            await client.close();
        }
    }

    async updateMultiDocument(collection, filter = [], update = []) {
        const client = new MongoClient(process.env.MONGO_URL);
        try {
            await client.connect();
            const database = client.db(this.db);
            const document = database.collection(collection);
            return await document
                .updateMany(filter, { $set: update });
        } catch (err) {
            console.log("Error :", err);
        } finally {
            await client.close();
        }
    }

    async replaceOneDocument(collection, filter = {}, replace = {}) {
        const client = new MongoClient(process.env.MONGO_URL);
        try {
            await client.connect();
            const database = client.db(this.db);
            const document = database.collection(collection);
            return await document
                .replaceOne(filter, replace);
        } catch (err) {
            console.log("Error :", err);
        } finally {
            await client.close();
        }
    }

    async deleteOneDocument(collection, filter = {}) {
        const client = new MongoClient(process.env.MONGO_URL);
        try {
            await client.connect();
            const database = client.db(this.db);
            const document = database.collection(collection);
            return await document
                .deleteOne(filter)
        } catch (err) {
            console.log("Error :", err);
        } finally {
            await client.close();
        }
    }

    async deleteMultiDocument(collection, filter = []) {
        const client = new MongoClient(process.env.MONGO_URL);
        try {
            await client.connect();
            const database = client.db(this.db);
            const document = database.collection(collection);
            return await document
                .deleteMany(filter)
        } catch (err) {
            console.log("Error :", err);
        } finally {
            await client.close();
        }
    }

    async countDocument(collection, filter = {}) {
        const client = new MongoClient(process.env.MONGO_URL);
        try {
            await client.connect();
            const database = client.db(this.db);
            const document = database.collection(collection);
            const estimateCountDoc = document.estimatedDocumentCount();
            const countDoc = document.countDocuments(filter);
            return { estimateCountDoc, countDoc };
        } catch (err) {
            console.log("Error :", err);
        } finally {
            await client.close();
        }
    }
}