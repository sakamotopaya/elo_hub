import { IVoiceRequest, IVoiceIntentHandler, IVoiceResponse } from "./device_control_intent";
import { ILogger } from "../logger";
import { IDeviceRepo } from "../device/device_repo";
import * as fs from 'fs';
import * as path from 'path';
import { ISystemConfig } from "../utility/utility";
import { exec } from "child_process";
import { container } from '../boot';
import { VstsFileNames, StandardVoiceResponses } from "../types";
import { VstsWorkitem, VstsUtilities } from "../utility/vsts";
import * as Speech from 'ssml-builder';

export interface AlexaSpeech {
    say(msg: string): AlexaSpeech;
    pause(time: string): AlexaSpeech;
    sayAs(options: any): AlexaSpeech;
    ssml(something: true): string;
};

var speech = new Speech();
speech.say('Hello')
    .pause('1s')
    .say('fellow Alexa developers')
    .pause('500ms')
    .say('Testing phone numbers')
    .sayAs({
        word: "+1-377-777-1888",
        interpret: "telephone"
    });
var speechOutput = speech.ssml(true);

export class ActiveTasksIntentHandler implements IVoiceIntentHandler {

    logger: ILogger;
    deviceFactory: IDeviceRepo;
    config: ISystemConfig;

    constructor(logger: ILogger, deviceFactory: IDeviceRepo, config: ISystemConfig) {
        this.config = config;
        this.deviceFactory = deviceFactory;
        this.logger = logger;
    }

    async handleIntent(request: IVoiceRequest, response: IVoiceResponse): Promise<IVoiceResponse> {
        let self = this;

        return new Promise<IVoiceResponse>((resolve, reject) => {
            let scriptToRun = path.join(this.config.vsts.scriptPath, VstsFileNames.ListActiveTasks);

            if (!fs.existsSync(scriptToRun)) {
                response.say(StandardVoiceResponses.MissingScript);
                return;
            }

            let fullCommandLine = scriptToRun + ' ' + this.config.vsts.vstsPath + ' ' + this.config.vsts.dataPath + ' ' + this.config.vsts.token + ' ' + this.config.vsts.activeTasksQueryId;

            exec(fullCommandLine, (error, stdout, stderr) => {
                console.log(stdout);
                console.log(stderr);
                console.log(JSON.stringify(error));

                if (!error || error === null) {
                    console.log('reading active tasks');

                    var activeTasks = <VstsWorkitem[]>JSON.parse(fs.readFileSync(path.join(self.config.vsts.dataPath, VstsFileNames.ActiveTaskResults), 'utf8'));
                    let complexSpeech = <AlexaSpeech>new Speech();

                    if (activeTasks.length > 0) {

                        let msg = "You have " + activeTasks.length + " task" + (activeTasks.length == 1 ? "" : "s") + ".";
                        complexSpeech.say(msg);

                        activeTasks.forEach((task) => {
                            complexSpeech.say("Task ")
                            .sayAs({
                                word: "" + task.id,
                                interpret: "digits"
                            })
                            .say(", " + VstsUtilities.getTitle(task) + '. ')
                            .say("Total complete work is " + VstsUtilities.getCompletedWork(task) + " hours with ")
                            .say("" + VstsUtilities.getRemainingWork(task) + " hours remaining. ");

                            //let tempBuf = "Task " + task.id + ", " + VstsUtilities.getTitle(task) + '. ';// + '<break time="1s"/>';
                            //tempBuf = tempBuf + "Total complete work is " + VstsUtilities.getCompletedWork(task) + " hours with ";
                            //tempBuf = tempBuf + VstsUtilities.getRemainingWork(task) + " hours remaining. ";

                            //msg += tempBuf;
                        });
                    } else {
                        complexSpeech.say("You have no active tasks as this time.");
                    }

                    response.say(complexSpeech.ssml(true));
                    resolve(response);
                }
            });
        });
    }
}