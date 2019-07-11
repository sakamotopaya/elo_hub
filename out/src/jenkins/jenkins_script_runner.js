"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const child_process_1 = require("child_process");
const types_1 = require("../types");
exports.JenkinsBuildCommandBuilder = (scriptToRun, jenkinsConfig) => {
    //curl -XGET http://${1}/job/${2}/lastBuild/api/json --basic -u ${3}:{4} > {$5}/jenkins_build_status.json
    return scriptToRun + ' ' + jenkinsConfig.url + ' ' + jenkinsConfig.defaultBuild + ' ' + jenkinsConfig.userName + ' ' +
        jenkinsConfig.password + ' ' + jenkinsConfig.dataPath + ' ' + types_1.JenkinsFileNames.BuildResults;
};
class JenkinsScriptRunner {
    constructor(config, scriptName, resultsName, commandBuilder) {
        this.config = config;
        this.scriptName = scriptName;
        this.resultsName = resultsName;
        this.commandBuilder = commandBuilder;
    }
    runWithResult() {
        let self = this;
        return new Promise((resolve, reject) => {
            let scriptToRun = path.join(self.config.scriptPath, self.scriptName);
            if (!fs.existsSync(scriptToRun)) {
                reject("missing script");
                return;
            }
            let fullCommandLine = self.commandBuilder(scriptToRun, self.config);
            child_process_1.exec(fullCommandLine, (error, stdout, stderr) => {
                console.log(stdout);
                console.log(stderr);
                console.log(JSON.stringify(error));
                if (!error || error === null) {
                    var results = JSON.parse(fs.readFileSync(path.join(self.config.dataPath, self.resultsName), 'utf8'));
                    resolve(results);
                }
            });
        });
    }
}
exports.JenkinsScriptRunner = JenkinsScriptRunner;
//# sourceMappingURL=jenkins_script_runner.js.map