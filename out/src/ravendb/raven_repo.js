"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ravendb_1 = require("ravendb");
class RavenRepo {
    constructor() {
        if (!RavenRepo.store) {
            RavenRepo.store = ravendb_1.default.create('http://pi3-dev:8080', 'test');
            RavenRepo.store.initialize();
        }
    }
    all(criteria) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let session = RavenRepo.store.openSession();
            let query = session.query({
                collection: 'documents',
            });
            let documents = yield query.all();
            let results = [];
            documents.forEach((sourceDoc) => {
                let doc = {};
                doc.id = sourceDoc.id;
                doc.documentType = "kb";
                doc.documentBody = sourceDoc;
                doc.category = "documents";
                results.push(doc);
            });
            resolve(results);
        }));
    }
    create(document) {
        let self = this;
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let session = RavenRepo.store.openSession();
            let model = document.documentBody;
            model.documentId = document.id;
            document.documentBody = yield session.store(model, 'documents/');
            resolve(document);
        }));
    }
    update(document) {
        let self = this;
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let session = RavenRepo.store.openSession();
            let doc = yield session.load('documents/' + document.documentBody.id);
            yield session.store(doc);
            yield session.saveChanges();
            resolve(document);
        }));
    }
    delete(category, documentType, id) {
        return new Promise((resolve, reject) => {
            resolve();
        });
    }
}
RavenRepo.store = undefined;
exports.RavenRepo = RavenRepo;
//# sourceMappingURL=raven_repo.js.map