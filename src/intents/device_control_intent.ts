import { ILogger } from "../logger";
import { Utility } from "../utility/utility";
import { IDeviceRepo } from "../device/device_repo";

export interface IVoiceIntentHandler {
    handleIntent(request: IVoiceRequest, response: IVoiceResponse): Promise<void>;
}

export interface IVoiceRequest {
    slot(key: string): string;
}

export interface IVoiceResponse {
    say(message: string): void;
}

export class DeviceControlIntentHandler implements IVoiceIntentHandler {

    logger: ILogger;
    deviceFactory: IDeviceRepo;

    constructor(logger: ILogger, deviceFactory: IDeviceRepo) {
        this.deviceFactory = deviceFactory;
        this.logger = logger;
    }

    async handleIntent(request: IVoiceRequest, response: IVoiceResponse): Promise<void> {
        var unprocessedName = request.slot("device_name");
        var deviceState = request.slot("device_state");

        this.logger.log(unprocessedName);

        var deviceName = Utility.unprocessedNameToDeviceName(unprocessedName);
        var device = this.deviceFactory.getDeviceByName(deviceName);

        if (device === null) {
            response.say("I don't recognize " + unprocessedName + " as a valid device.");
            return;
        }

        try {
        if (deviceState === "off")
            await device.setOff();
        else if (deviceState === "on")
            await device.setOn();
        } catch (e){
            console.error(e)            
        }
    }
}