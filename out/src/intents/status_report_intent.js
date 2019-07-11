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
const Speech = require("ssml-builder");
const knowledge_doc_parser_1 = require("../documents/knowledge_doc_parser");
class StatusReportIntentHandler {
    constructor(logger, config) {
        this.config = config;
        this.logger = logger;
    }
    handleIntent(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            let self = this;
            return new Promise((resolve, reject) => {
                let complexSpeech = new Speech();
                let scanner = new knowledge_doc_parser_1.RepoScanner(self.config.knowledgeDoc);
                let result = scanner.scan().then((scanResults) => {
                    let doc = scanResults.docs.find((item) => {
                        if (item.name == "elk_status.md")
                            return true;
                        return false;
                    });
                    if (!doc)
                        complexSpeech.say("I couldn't find the status report,");
                    else {
                        complexSpeech.say("Here is the current status: ");
                        complexSpeech.pause("1s");
                        complexSpeech.say(doc.summary.text);
                    }
                    //response.shouldEndSession(false);
                    response.say(complexSpeech.ssml(true));
                    resolve(response);
                });
                Promise.all([result]);
            });
        });
    }
}
exports.StatusReportIntentHandler = StatusReportIntentHandler;
//# sourceMappingURL=status_report_intent.js.map