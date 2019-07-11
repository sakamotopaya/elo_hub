"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AlexaLaunchHandler {
    constructor(logger, deviceFactory) {
        this.deviceFactory = deviceFactory;
        this.logger = logger;
    }
    handleIntent(request, response) {
        return new Promise((resolve, reject) => {
            response.say("howdy");
            resolve(response);
        });
    }
}
exports.AlexaLaunchHandler = AlexaLaunchHandler;
//# sourceMappingURL=alexa_launch_handler.js.map