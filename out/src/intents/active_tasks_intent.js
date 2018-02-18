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
class ActiveTasksIntentHandler {
    constructor(logger, vstsRepo, config) {
        this.config = config;
        this.vstsRepo = vstsRepo;
        this.logger = logger;
    }
    handleIntent(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            let self = this;
            return new Promise((resolve, reject) => {
                let activeTasks = self.vstsRepo.getActiveTasks();
                let complexSpeech = new Speech();
                if (activeTasks.length > 0) {
                    let msg = "You have " + activeTasks.length + " task" + (activeTasks.length == 1 ? "" : "s") + ".";
                    let index = 0;
                    complexSpeech.say(msg);
                    complexSpeech.pause('300ms');
                    activeTasks.forEach((task) => {
                        index += 1;
                        complexSpeech.say("" + index)
                            .pause('300ms')
                            .sayAs({
                            word: "" + task.id,
                            interpret: "digits"
                        })
                            .pause('500ms')
                            .say(", " + task.title + '. ')
                            .pause('300ms')
                            .say("Total complete work is " + task.completedWork + " hours with ")
                            .say("" + task.remainingWork + " hours remaining. ")
                            .pause('500ms');
                    });
                }
                else {
                    complexSpeech.say("You have no active tasks as this time.").pause('300ms');
                }
                request.getSession().set("taskContext", "active");
                complexSpeech.say("What else do you need me for?");
                //response.shouldEndSession(false);
                response.say(complexSpeech.ssml(true));
                resolve(response);
            });
        });
    }
}
exports.ActiveTasksIntentHandler = ActiveTasksIntentHandler;
//# sourceMappingURL=active_tasks_intent.js.map