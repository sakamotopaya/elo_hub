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
const child_process_1 = require("child_process");
const fs = require("fs");
const path = require("path");
const types_1 = require("../types");
class QueueBuildIntentHandler {
    constructor(logger, deviceFactory, config) {
        this.deviceFactory = deviceFactory;
        this.logger = logger;
        this.config = config;
    }
    getQueueBuildScriptPath() {
        return path.join(this.config.vsts.scriptPath, types_1.VstsFileNames.QueueBuild);
    }
    handleIntent(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                console.log('queuing a build...');
                let scriptToRun = path.join(this.config.vsts.scriptPath, types_1.VstsFileNames.QueueBuild);
                if (!fs.existsSync(scriptToRun)) {
                    response.say(types_1.StandardVoiceResponses.MissingScript);
                    resolve(response);
                    return;
                }
                let fullCommandLine = scriptToRun + ' ' + this.config.vsts.vstsPath + ' ' + this.config.vsts.dataPath + ' ' + this.config.vsts.token + ' ' + 'Karmak_Integrations';
                child_process_1.exec(fullCommandLine, (error, stdout, stderr) => {
                    if (!error || error === null) {
                        console.log('build queued...');
                        response.say("Ok! A build has been queued");
                    }
                    else {
                        console.log(stdout);
                        console.log(stderr);
                        console.log(JSON.stringify(error));
                        response.say("There was an error when I tried to queue the build.");
                    }
                    resolve(response);
                });
            });
        });
    }
}
exports.QueueBuildIntentHandler = QueueBuildIntentHandler;
//# sourceMappingURL=queue_build_intent.js.map