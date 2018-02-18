import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { ISystemConfig, IVstsConfig } from '../utility/utility';

type VstsCommandBuilder = (scriptToRun: string, vstsConfig: IVstsConfig) => string;

export const VstsActiveTaskCommandBuilder: VstsCommandBuilder = (scriptToRun: string, vstsConfig: IVstsConfig) => {
    return scriptToRun + ' ' + vstsConfig.vstsPath + ' ' + vstsConfig.dataPath + ' ' + vstsConfig.token + ' ' + vstsConfig.activeTasksQueryId;
};

export class VstsScriptRunner<T> {

    config: ISystemConfig;
    scriptName: string;
    resultsName: string;
    commandBuilder: VstsCommandBuilder;

    constructor(config: ISystemConfig, scriptName: string, resultsName: string, commandBuilder: VstsCommandBuilder) {
        this.config = config;
        this.scriptName = scriptName;
        this.resultsName = resultsName;
        this.commandBuilder = commandBuilder;
    }
    
    public runWithResult() : Promise<T[]> {
        let self = this;

        return new Promise<T[]>((resolve, reject) => {
            let scriptToRun = path.join(self.config.vsts.scriptPath, self.scriptName);

            if (!fs.existsSync(scriptToRun)) {
                reject("missing script");
                return;
            }

            let fullCommandLine = self.commandBuilder(scriptToRun, self.config.vsts);

            exec(fullCommandLine, (error, stdout, stderr) => {
                console.log(stdout);
                console.log(stderr);
                console.log(JSON.stringify(error));

                if (!error || error === null) {
                    console.log('reading active tasks');

                    var results = <T[]>JSON.parse(fs.readFileSync(path.join(self.config.vsts.dataPath, self.resultsName), 'utf8'));
                    resolve(results);
                }
            });
        });

    }
}