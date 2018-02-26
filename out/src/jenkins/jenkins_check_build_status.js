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
const types_1 = require("../types");
const topic_handler_factory_1 = require("../topics/topic_handler_factory");
const jenkins_script_runner_1 = require("./jenkins_script_runner");
class JenkinsCheckBuildStatusJob {
    run(container, config) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            console.log('checking jenkins build status...');
            let jenkins;
            if (typeof config.featureSet.jenkins === "boolean") {
                let jenkinsEnabled = config.featureSet.jenkins;
                if (jenkinsEnabled) {
                    if (!config.jenkins) {
                        reject(new Error('when featureSet.jenkins is boolean true, config.jenkins needs to be set!'));
                        return;
                    }
                    else
                        jenkins = config.jenkins;
                }
                else {
                    resolve();
                    return;
                }
            }
            else
                jenkins = config.featureSet.jenkins;
            let scriptRunner = new jenkins_script_runner_1.JenkinsScriptRunner(jenkins, types_1.JenkinsFileNames.CheckBuildStatus, types_1.JenkinsFileNames.BuildResults, jenkins_script_runner_1.JenkinsBuildCommandBuilder);
            let buildStatus = yield scriptRunner.runWithResult();
            let state = 0;
            if (buildStatus.building)
                state = 2;
            else if (buildStatus.result === "ABORTED" || buildStatus.result === "SUCCESS")
                state = 1;
            let deviceRepo = container.get(types_1.TYPES.DeviceRepo);
            let rulesEngine = container.get(types_1.TYPES.IndicatorRulesEngine);
            let stateHandler = new topic_handler_factory_1.DeviceStateHandler('elo_bld', deviceRepo, rulesEngine);
            stateHandler.handleMessage("elo/elo_bld/state", JSON.stringify({ v1: state }));
            resolve();
        }));
    }
}
exports.JenkinsCheckBuildStatusJob = JenkinsCheckBuildStatusJob;
;
//# sourceMappingURL=jenkins_check_build_status.js.map