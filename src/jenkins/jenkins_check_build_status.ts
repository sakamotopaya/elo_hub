import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as process from 'process';
import { Container } from "inversify";
import { ISystemConfig } from "../utility/utility";
import { VstsFileNames, TYPES, JenkinsFileNames } from "../types";
import { IScheduledJob } from '../sch_jobs';
import { DeviceStateHandler } from '../topics/topic_handler_factory';
import { IIndicatorRulesEngine } from '../indicator/indicator_repo';
import { IDeviceRepo } from '../device/device_repo';
import { IJenkinsConfig } from '../utility/interface';
import { JenkinsScriptRunner, JenkinsBuildCommandBuilder } from './jenkins_script_runner';
import { JenkinsBuild } from './jenkins';

export class JenkinsCheckBuildStatusJob implements IScheduledJob {
    run(container: Container, config: ISystemConfig): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            console.log('checking jenkins build status...');

            let jenkins: IJenkinsConfig;

            if (typeof config.featureSet.jenkins === "boolean") {
                let jenkinsEnabled: boolean = config.featureSet.jenkins;

                if (jenkinsEnabled) {
                    if (!config.jenkins) {
                        reject(new Error('when featureSet.jenkins is boolean true, config.jenkins needs to be set!'));
                        return;
                    } else
                        jenkins = config.jenkins;
                } else {
                    resolve();
                    return;
                }
            } else
                jenkins = <IJenkinsConfig>config.featureSet.jenkins;

            let scriptRunner = new JenkinsScriptRunner<JenkinsBuild>(jenkins, JenkinsFileNames.CheckBuildStatus, JenkinsFileNames.BuildResults, JenkinsBuildCommandBuilder);
            let buildStatus = await scriptRunner.runWithResult()
            let state = 0;

            if (buildStatus.building)
                state = 2;
            else if (buildStatus.result === "ABORTED" || buildStatus.result === "SUCCESS")
                state = 1;

            let deviceRepo: IDeviceRepo = container.get<IDeviceRepo>(TYPES.DeviceRepo);
            let rulesEngine: IIndicatorRulesEngine = container.get<IIndicatorRulesEngine>(TYPES.IndicatorRulesEngine);
            let stateHandler = new DeviceStateHandler('elo_bld', deviceRepo, rulesEngine);

            stateHandler.handleMessage("elo/elo_bld/state", JSON.stringify({ v1: state }));
            resolve();

        });
    }
};
