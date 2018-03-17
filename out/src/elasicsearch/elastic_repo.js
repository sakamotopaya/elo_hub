"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const elasticsearch = require("elasticsearch");
class ElasticRepo {
    constructor(config) {
        this.config = config;
    }
    getClient(config) {
        let client = new elasticsearch.Client({
            host: config.url,
            log: config.logLevel
        });
        return client;
    }
    create(document) {
        let self = this;
        return new Promise((resolve, reject) => {
            let client = self.getClient(self.config.elasticSearch);
            client.create({
                index: document.category,
                type: document.documentType,
                id: document.id,
                body: document.documentBody
            }, function (error, response) {
                if (error)
                    reject(error);
                else
                    resolve(response);
            });
        });
    }
    update(document) {
        let self = this;
        return new Promise((resolve, reject) => {
            let client = self.getClient(self.config.elasticSearch);
            client.update({
                index: document.category,
                type: document.documentType,
                id: document.id,
                body: { doc: document.documentBody }
            }, function (error, response) {
                if (error)
                    reject(error);
                else
                    resolve(response);
            });
        });
    }
    delete(category, documentType, id) {
        return new Promise((resolve, reject) => {
            let client = this.getClient(this.config.elasticSearch);
            client.delete({
                index: category,
                type: documentType,
                id: id
            }, function (error, response) {
                if (error)
                    reject(error);
                else
                    resolve(response);
            });
        });
    }
    all(criteria) {
        return new Promise((resolve, reject) => {
            let client = this.getClient(this.config.elasticSearch);
            client.search({
                index: criteria.category,
                type: criteria.documentType,
                body: {
                    query: {
                        match_all: {}
                    }
                }
            }).then(function (resp) {
                var hits = resp.hits.hits;
                resolve(hits);
            }, function (err) {
                reject(err);
            });
        });
    }
    search(criteria) {
        return new Promise((resolve, reject) => {
            let client = this.getClient(this.config.elasticSearch);
            client.search({
                index: criteria.category,
                type: criteria.documentType,
                body: criteria.criteria
            }).then(function (resp) {
                var hits = resp.hits.hits;
                resolve(hits);
            }, function (err) {
                reject(err);
            });
        });
    }
}
exports.ElasticRepo = ElasticRepo;
//# sourceMappingURL=elastic_repo.js.map