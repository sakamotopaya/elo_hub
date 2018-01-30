"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const boot_1 = require("./boot");
const app_1 = require("./app");
const types_1 = require("./types");
const child_process_1 = require("child_process");
const fs = require("fs");
const topic_handler_factory_1 = require("./topics/topic_handler_factory");
const port = parseInt(process.env.PORT) || 3000;
var config = {
    messaging: {
        hubUrl: 'mqtt://pi3_hub',
        listenerDisabled: false,
        listenerPattern: 'elo/#'
    },
    build: {
        scriptPath: '/home/pi/.elo_hub'
    }
};
boot_1.container.bind(types_1.TYPES.Config).toConstantValue(config);
setInterval(() => {
    console.log('checking build status...');
    child_process_1.exec(config.build.scriptPath + '/check_build_status.sh', (error, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        console.log(JSON.stringify(error));
        if (!error || error === null) {
            console.log('reading build status');
            var buildStatus = JSON.parse(fs.readFileSync(config.build.scriptPath + '/build_status.json', 'utf8'))[0];
            var state = 0;
            if (buildStatus.status === "inProgress")
                state = 2;
            else if (buildStatus.status === "completed" && buildStatus.result === "succeeded")
                state = 1;
            let deviceRepo = boot_1.container.get(types_1.TYPES.DeviceRepo);
            let rulesEngine = boot_1.container.get(types_1.TYPES.IndicatorRulesEngine);
            let stateHandler = new topic_handler_factory_1.DeviceStateHandler('elo_bld', deviceRepo, rulesEngine);
            stateHandler.handleMessage("elo/elo_bld/state", JSON.stringify({ v1: state }));
        }
    });
}, 30 * 1000);
const app = new app_1.App();
app.run(port);
//# sourceMappingURL=index.js.map