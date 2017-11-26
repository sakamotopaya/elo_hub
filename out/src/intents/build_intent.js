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
class BuildIntentHandler {
    constructor(logger, deviceFactory) {
        this.deviceFactory = deviceFactory;
        this.logger = logger;
    }
    handleIntent(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            var buildStatus = JSON.parse(fs.readFileSync('build_status.json', 'utf8'))[0];
            var msg = "The build be doing some funky stuff!";
            if (buildStatus.status !== "completed")
                msg = "a build is currently running";
            if (buildStatus.result === "succeeded") {
                msg = "The last build succeeded";
            }
            else if (buildStatus.result === "failed") {
                msg = "The last build failed";
            }
            response.say(msg);
        });
    }
}
exports.BuildIntentHandler = BuildIntentHandler;
//# sourceMappingURL=build_intent.js.map