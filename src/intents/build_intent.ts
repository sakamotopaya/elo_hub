import { IVoiceRequest, IVoiceIntentHandler, IVoiceResponse } from "./device_control_intent";
import { ILogger } from "../logger";
import { IDeviceRepo } from "../device/device_repo";
import * as fs from 'fs';

export class BuildIntentHandler implements IVoiceIntentHandler {
    
        logger: ILogger;
        deviceFactory: IDeviceRepo;
    
        constructor(logger: ILogger, deviceFactory: IDeviceRepo) {
            this.deviceFactory = deviceFactory;
            this.logger = logger;
        }
    
        async handleIntent(request: IVoiceRequest, response: IVoiceResponse): Promise<void> {
            var buildStatus = JSON.parse(fs.readFileSync('build_status.json', 'utf8'))[0];
            var msg = "The build be doing some funky stuff!";
    
            if (buildStatus.status !== "completed")
              msg = "a build is currently running";
            if (buildStatus.result === "succeeded") {
              msg = "The last build succeeded";
            } else if (buildStatus.result === "failed") {
              msg = "The last build failed";
            }
    
            response.say(msg);
        }
    }