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
class QueueBuildIntentHandler {
    constructor(logger, deviceFactory) {
        this.deviceFactory = deviceFactory;
        this.logger = logger;
    }
    handleIntent(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('queuing a build...');
            child_process_1.exec('/home/pi/code/elo_alexa/queue_build.sh', (error, stdout, stderr) => {
                console.log(stdout);
                console.log(stderr);
                console.log(JSON.stringify(error));
                console.log('build queued...');
                response.say("Ok! A build has been queued");
            });
        });
    }
}
exports.QueueBuildIntentHandler = QueueBuildIntentHandler;
//# sourceMappingURL=queue_build_intent.js.map