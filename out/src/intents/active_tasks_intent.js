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
const child_process_1 = require("child_process");
const types_1 = require("../types");
const vsts_1 = require("../utility/vsts");
const Speech = require("ssml-builder");
;
var speech = new Speech();
speech.say('Hello')
    .pause('1s')
    .say('fellow Alexa developers')
    .pause('500ms')
    .say('Testing phone numbers')
    .sayAs({
    word: "+1-377-777-1888",
    interpret: "telephone"
});
var speechOutput = speech.ssml(true);
class ActiveTasksIntentHandler {
    constructor(logger, deviceFactory, config) {
        this.config = config;
        this.deviceFactory = deviceFactory;
        this.logger = logger;
    }
    handleIntent(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            let self = this;
            return new Promise((resolve, reject) => {
                let scriptToRun = path.join(this.config.vsts.scriptPath, types_1.VstsFileNames.ListActiveTasks);
                if (!fs.existsSync(scriptToRun)) {
                    response.say(types_1.StandardVoiceResponses.MissingScript);
                    return;
                }
                let fullCommandLine = scriptToRun + ' ' + this.config.vsts.vstsPath + ' ' + this.config.vsts.dataPath + ' ' + this.config.vsts.token + ' ' + this.config.vsts.activeTasksQueryId;
                child_process_1.exec(fullCommandLine, (error, stdout, stderr) => {
                    console.log(stdout);
                    console.log(stderr);
                    console.log(JSON.stringify(error));
                    if (!error || error === null) {
                        console.log('reading active tasks');
                        var activeTasks = JSON.parse(fs.readFileSync(path.join(self.config.vsts.dataPath, types_1.VstsFileNames.ActiveTaskResults), 'utf8'));
                        let complexSpeech = new Speech();
                        if (activeTasks.length > 0) {
                            let msg = "You have " + activeTasks.length + " task" + (activeTasks.length == 1 ? "" : "s") + ".";
                            complexSpeech.say(msg);
                            activeTasks.forEach((task) => {
                                complexSpeech.say("Task ")
                                    .sayAs({
                                    word: "" + task.id,
                                    interpret: "digits"
                                })
                                    .say(", " + vsts_1.VstsUtilities.getTitle(task) + '. ')
                                    .say("Total complete work is " + vsts_1.VstsUtilities.getCompletedWork(task) + " hours with ")
                                    .say("" + vsts_1.VstsUtilities.getRemainingWork(task) + " hours remaining. ");
                                //let tempBuf = "Task " + task.id + ", " + VstsUtilities.getTitle(task) + '. ';// + '<break time="1s"/>';
                                //tempBuf = tempBuf + "Total complete work is " + VstsUtilities.getCompletedWork(task) + " hours with ";
                                //tempBuf = tempBuf + VstsUtilities.getRemainingWork(task) + " hours remaining. ";
                                //msg += tempBuf;
                            });
                        }
                        else {
                            complexSpeech.say("You have no active tasks as this time.");
                        }
                        response.say(complexSpeech.ssml(true));
                        resolve(response);
                    }
                });
            });
        });
    }
}
exports.ActiveTasksIntentHandler = ActiveTasksIntentHandler;
//# sourceMappingURL=active_tasks_intent.js.map