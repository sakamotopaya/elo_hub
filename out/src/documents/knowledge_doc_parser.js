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
const fs = require("fs");
const path = require("path");
const readline = require("readline");
const knowledge_doc_1 = require("./knowledge_doc");
class ParserState {
    constructor() {
        this.doc = new knowledge_doc_1.KnowledgeDoc();
        this.inSummary = false;
        this.inText = false;
    }
}
exports.ParserState = ParserState;
;
;
class KnowledgeDocParser {
    constructor(fullPathToDocument) {
        this.fullPathToDocument = fullPathToDocument;
        this.parserState = new ParserState();
    }
    parseDocument() {
        return this.readFile2();
    }
    readFile2() {
        let self = this;
        return new Promise((resolve, reject) => {
            var input = fs.createReadStream(self.fullPathToDocument);
            let lineReader = readline.createInterface({
                input: input,
                terminal: false
            });
            lineReader.on('line', function (line) {
                self.processLine(line);
            });
            lineReader.on('close', function () {
                input.close();
                resolve(self.parserState.doc);
            });
        });
    }
    readFile1(input, state) {
        let self = this;
        return new Promise((resolve, reject) => {
            var remaining = '';
            input.on('data', function (data) {
                remaining += data;
                var index = remaining.indexOf('\n');
                var last = 0;
                while (index > -1) {
                    var line = remaining.substring(last, index);
                    last = index + 1;
                    self.processLine(line);
                    index = remaining.indexOf('\n', last);
                }
                remaining = remaining.substring(last);
            });
            input.on('end', function () {
                if (remaining.length > 0) {
                    self.processLine(remaining);
                }
            });
        });
    }
    processLine(line) {
        let state = this.parserState;
        state.doc.originalDocument.push(line);
        if (line.startsWith("## ") && state.inSummary) {
            state.inSummary = false;
            state.doc.summary = state.currentItem;
        }
        else if (line.startsWith("## Summary")) {
            state.inSummary = true;
            state.currentItem = new knowledge_doc_1.SummaryItem("");
            state.doc.items.push(state.currentItem);
        }
        else if (state.inSummary && line.trim().length > 0) {
            state.inText = true;
            let summary = state.currentItem;
            summary.text = summary.text + ' ' + line;
        }
        else if (state.inSummary && line.trim() == '' && state.inText) {
            state.inSummary = false;
            state.doc.summary = state.currentItem;
        }
        else {
            if (state.inSummary) {
                let summary = state.currentItem;
                summary.text = summary.text + ' ' + line;
            }
        }
    }
}
exports.KnowledgeDocParser = KnowledgeDocParser;
;
class RepoScannerResult {
    constructor() {
        this.folderIndex = [];
        this.fileIndex = [];
        this.docs = [];
    }
}
exports.RepoScannerResult = RepoScannerResult;
;
class RepoScanner {
    constructor(config) {
        this.config = config;
    }
    scan() {
        let pathRoot = this.config.repoRoot;
        let self = this;
        let seed = new RepoScannerResult();
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let result = self.processFolder(pathRoot, seed);
            result.then(resolve).catch(reject);
        }));
    }
    processFolder(pathRoot, result) {
        let self = this;
        let innerResult = result;
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            fs.readdir(pathRoot, (err, files) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    reject(err);
                    return;
                }
                let asyncOperations = [];
                files.forEach(fileName => {
                    let fullPath = path.join(pathRoot, fileName);
                    let isDirectory = fs.lstatSync(fullPath).isDirectory();
                    if (isDirectory) {
                        result.folderIndex.push(fullPath);
                        if (self.shouldProcessThisFolder(fileName)) {
                            let scanOp = self.processFolder(fullPath, result);
                            asyncOperations.push(scanOp);
                        }
                    }
                    else {
                        if (self.shouldProcessThisFile(fileName)) {
                            result.fileIndex.push(fullPath);
                            if (fileName == "elk_status.md")
                                console.log('here');
                            console.log('processing ' + fullPath);
                            let parser = new KnowledgeDocParser(fullPath);
                            let parseOp = parser.parseDocument().then((doc) => {
                                doc.name = fileName;
                                doc.path = fullPath;
                                result.docs.push(doc);
                            });
                            asyncOperations.push(parseOp);
                        }
                    }
                });
                Promise.all(asyncOperations).then(() => resolve(result));
            }));
        }));
    }
    shouldProcessThisFile(fileName) {
        return true;
    }
    shouldProcessThisFolder(folderName) {
        return folderName !== ".git" && folderName !== ".attachments";
    }
}
exports.RepoScanner = RepoScanner;
;
class KnowledgeDocumentRepo {
}
exports.KnowledgeDocumentRepo = KnowledgeDocumentRepo;
;
//# sourceMappingURL=knowledge_doc_parser.js.map