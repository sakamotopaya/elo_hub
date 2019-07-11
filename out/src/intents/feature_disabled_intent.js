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
class FeatureDisabledIntentHandler {
    constructor(logger) {
        this.logger = logger;
    }
    handleIntent(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            let self = this;
            return new Promise((resolve, reject) => {
                let complexSpeech = new Speech();
                complexSpeech.say("This feature is currently disabled");
                response.say(complexSpeech.ssml(true));
                resolve(response);
            });
        });
    }
}
exports.FeatureDisabledIntentHandler = FeatureDisabledIntentHandler;
//# sourceMappingURL=feature_disabled_intent.js.map