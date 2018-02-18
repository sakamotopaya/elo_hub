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
const topic_handler_factory_1 = require("./topics/topic_handler_factory");
const types_1 = require("./types");
const child_process_1 = require("child_process");
const fs = require("fs");
const path = require("path");
const vsts_script_runner_1 = require("./vsts/vsts_script_runner");
;
class CheckBuildStatusJob {
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
exports.CheckBuildStatusJob = CheckBuildStatusJob;
;
class RefreshActiveTasksJob {
    run(container, config) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            console.log('refreshing active tasks...');
            try {
                let scriptRunner = new vsts_script_runner_1.VstsScriptRunner(config, types_1.VstsFileNames.ListActiveTasks, types_1.VstsFileNames.ActiveTaskResults, vsts_script_runner_1.VstsActiveTaskCommandBuilder);
                let result = yield scriptRunner.runWithResult();
                let vstsRepo = container.get(types_1.TYPES.VstsRepo);
                vstsRepo.mergeTaskState(result);
                resolve();
            }
            catch (Err) {
                reject(Err);
            }
        }));
    }
}
exports.RefreshActiveTasksJob = RefreshActiveTasksJob;
//# sourceMappingURL=sch_jobs.js.map