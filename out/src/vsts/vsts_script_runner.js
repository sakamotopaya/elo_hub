"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const fs = require("fs");
const path = require("path");
const child_process_1 = require("child_process");
exports.VstsActiveTaskCommandBuilder = (scriptToRun, vstsConfig) => {
    return scriptToRun + ' ' + vstsConfig.vstsPath + ' ' + vstsConfig.dataPath + ' ' + vstsConfig.token + ' ' + vstsConfig.activeTasksQueryId;
};
class VstsScriptRunner {
    constructor(config, scriptName, resultsName, commandBuilder) {
        this.config = config;
        this.scriptName = scriptName;
        this.resultsName = resultsName;
        this.commandBuilder = commandBuilder;
    }
    runWithResult() {
        let self = this;
        return new Promise((resolve, reject) => {
            let scriptToRun = path.join(self.config.vsts.scriptPath, self.scriptName);
            if (!fs.existsSync(scriptToRun)) {
                reject("missing script");
                return;
            }
            let fullCommandLine = self.commandBuilder(scriptToRun, self.config.vsts);
            child_process_1.exec(fullCommandLine, (error, stdout, stderr) => {
                console.log(stdout);
                console.log(stderr);
                console.log(JSON.stringify(error));
                if (!error || error === null) {
                    console.log('reading active tasks');
                    var results = JSON.parse(fs.readFileSync(path.join(self.config.vsts.dataPath, self.resultsName), 'utf8'));
                    resolve(results);
                }
            });
        });
    }
}
exports.VstsScriptRunner = VstsScriptRunner;
;
class VstsQueueBuild {
    queue(config) {
    }
}
exports.VstsQueueBuild = VstsQueueBuild;
;
class JenkinsQueueBuild {
    queue(config) {
        return new Promise((resolve, reject) => {
            axios_1.default.post('', {})
                .then(function (axiosResponse) {
                console.log('back from device', JSON.stringify(axiosResponse.data));
                resolve(axiosResponse.data);
            })
                .catch(function (axiosError) {
                console.log('error calling device' + JSON.stringify(axiosError));
                reject(axiosError);
            });
        });
    }
}
exports.JenkinsQueueBuild = JenkinsQueueBuild;
//# sourceMappingURL=vsts_script_runner.js.map