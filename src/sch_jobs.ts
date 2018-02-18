import { container } from './boot';
import { IDeviceRepo } from "./device/device_repo";
import { IIndicatorRulesEngine } from "./indicator/indicator_repo";
import { DeviceStateHandler } from "./topics/topic_handler_factory";
import { TYPES, VstsFileNames } from "./types";
import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as process from 'process';
import { ISystemConfig } from "./utility/utility";
import { Container } from 'inversify';
import { VstsScriptRunner, VstsActiveTaskCommandBuilder } from './vsts/vsts_script_runner';
import { VstsWorkitem } from './vsts/vsts';
import { IVstsRepo } from './vsts/vsts_repo';


export interface IScheduledJob {
    run(container: Container, config: ISystemConfig): Promise<void>;
};

export class CheckBuildStatusJob implements IScheduledJob {
    run(container: Container, config: ISystemConfig): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            console.log('checking build status...');
            let scriptToRun = path.join(config.vsts.scriptPath, VstsFileNames.CheckBuildStatus);
            let fullCommandLine = scriptToRun + ' ' + config.vsts.vstsPath + ' ' + config.vsts.dataPath + ' ' + config.vsts.token;


            exec(fullCommandLine, (error, stdout, stderr) => {
                console.log(stdout);
                console.log(stderr);
                console.log(JSON.stringify(error));

                if (!error || error === null) {
                    console.log('reading build status');

                    var buildStatus = JSON.parse(fs.readFileSync(path.join(config.vsts.dataPath, VstsFileNames.BuildResults), 'utf8'))[0];
                    var state = 0;

                    if (buildStatus.status === "inProgress")
                        state = 2;
                    else if (buildStatus.status === "completed" && buildStatus.result === "succeeded")
                        state = 1;

                    let deviceRepo: IDeviceRepo = container.get<IDeviceRepo>(TYPES.DeviceRepo);
                    let rulesEngine: IIndicatorRulesEngine = container.get<IIndicatorRulesEngine>(TYPES.IndicatorRulesEngine);
                    let stateHandler = new DeviceStateHandler('elo_bld', deviceRepo, rulesEngine);

                    stateHandler.handleMessage("elo/elo_bld/state", JSON.stringify({ v1: state }));
                    resolve();
                } else
                    reject();
            });
        });
    }
};

export class RefreshActiveTasksJob implements IScheduledJob {
    run(container: Container, config: ISystemConfig): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            console.log('refreshing active tasks...');

            try {
                let scriptRunner = new VstsScriptRunner<VstsWorkitem>(config, VstsFileNames.ListActiveTasks, VstsFileNames.ActiveTaskResults, VstsActiveTaskCommandBuilder);
                let result = await scriptRunner.runWithResult();

                let vstsRepo = container.get<IVstsRepo>(TYPES.VstsRepo);
                vstsRepo.mergeTaskState(result);

                resolve();
            } catch (Err) {
                reject(Err);
            }
        });
    }
}