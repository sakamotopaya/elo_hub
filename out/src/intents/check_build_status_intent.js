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
const types_1 = require("../types");
class CheckBuildStatusIntentHandler {
    constructor(logger, deviceFactory, config) {
        this.deviceFactory = deviceFactory;
        this.logger = logger;
        this.config = config;
    }
    getBuildResultFullPath() {
        return path.join(this.config.vsts.dataPath, types_1.VstsFileNames.BuildResults);
    }
    handleIntent(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let buildResultPath = this.getBuildResultFullPath();
                if (!fs.existsSync(buildResultPath)) {
                    response.say(types_1.StandardVoiceResponses.MissingBuildResults);
                }
                else {
                    var buildStatus = JSON.parse(fs.readFileSync(buildResultPath, 'utf8'))[0];
                    var msg = "The build be doing some funky stuff!";
                    if (buildStatus.status !== "inProgress")
                        msg = "a build is currently running";
                    if (buildStatus.status !== "completed")
                        msg = "a build is currently running";
                    if (buildStatus.result === "succeeded") {
                        msg = "The last build succeeded";
                    }
                    else if (buildStatus.result === "failed") {
                        msg = "The last build failed";
                    }
                    response.say(msg);
                }
                resolve(response);
            });
        });
    }
}
exports.CheckBuildStatusIntentHandler = CheckBuildStatusIntentHandler;
//# sourceMappingURL=check_build_status_intent.js.map