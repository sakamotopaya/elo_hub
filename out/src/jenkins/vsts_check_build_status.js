"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const fs = require("fs");
const path = require("path");
const types_1 = require("../types");
const topic_handler_factory_1 = require("../topics/topic_handler_factory");
class VstsCheckBuildStatusJob {
    run(container, config) {
        return new Promise((resolve, reject) => {
            console.log('checking build status...');
            let scriptToRun = path.join(config.vsts.scriptPath, types_1.VstsFileNames.CheckBuildStatus);
            let fullCommandLine = scriptToRun + ' ' + config.vsts.vstsPath + ' ' + config.vsts.dataPath + ' ' + config.vsts.token;
            child_process_1.exec(fullCommandLine, (error, stdout, stderr) => {
                console.log(stdout);
                console.log(stderr);
                console.log(JSON.stringify(error));
                if (!error || error === null) {
                    console.log('reading build status');
                    var buildStatus = JSON.parse(fs.readFileSync(path.join(config.vsts.dataPath, types_1.VstsFileNames.BuildResults), 'utf8'))[0];
                    var state = 0;
                    if (buildStatus.status === "inProgress")
                        state = 2;
                    else if (buildStatus.status === "completed" && buildStatus.result === "succeeded")
                        state = 1;
                    let deviceRepo = container.get(types_1.TYPES.DeviceRepo);
                    let rulesEngine = container.get(types_1.TYPES.IndicatorRulesEngine);
                    let stateHandler = new topic_handler_factory_1.DeviceStateHandler('elo_bld', deviceRepo, rulesEngine);
                    stateHandler.handleMessage("elo/elo_bld/state", JSON.stringify({ v1: state }));
                    resolve();
                }
                else
                    reject();
            });
        });
    }
}
exports.VstsCheckBuildStatusJob = VstsCheckBuildStatusJob;
;
//# sourceMappingURL=vsts_check_build_status.js.map