import { IVoiceRequest, IVoiceIntentHandler, IVoiceResponse } from "./device_control_intent";
import { ILogger } from "../logger";
import { IDeviceRepo } from "../device/device_repo";


export class AlexaLaunchHandler implements IVoiceIntentHandler {
    
        logger: ILogger;
        deviceFactory: IDeviceRepo;
    
        constructor(logger: ILogger, deviceFactory: IDeviceRepo) {
            this.deviceFactory = deviceFactory;
            this.logger = logger;
        }
    
        async handleIntent(request: IVoiceRequest, response: IVoiceResponse): Promise<void> {
            response.say("howdy");
        }
    }