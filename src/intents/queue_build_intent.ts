import { IVoiceRequest, IVoiceIntentHandler, IVoiceResponse } from "./device_control_intent";
import { ILogger } from "../logger";
import { IDeviceRepo } from "../device/device_repo";
import { exec } from 'child_process'

export class QueueBuildIntentHandler implements IVoiceIntentHandler {
    
        logger: ILogger;
        deviceFactory: IDeviceRepo;
    
        constructor(logger: ILogger, deviceFactory: IDeviceRepo) {
            this.deviceFactory = deviceFactory;
            this.logger = logger;
        }
    
        async handleIntent(request: IVoiceRequest, response: IVoiceResponse): Promise<void> {
            console.log('queuing a build...');
            exec('/home/openhabian/code/elo_alexa/queue_build.sh',
              (error, stdout, stderr) => {
                console.log(stdout);
                console.log(stderr);
                console.log(JSON.stringify(error));
                console.log('build queued...');
                response.say("Ok! A build has been queued");
              });
        }
    }