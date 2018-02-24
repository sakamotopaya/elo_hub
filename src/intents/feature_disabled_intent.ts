import { IVoiceRequest, IVoiceIntentHandler, IVoiceResponse, AlexaSpeech } from "../voice_handler";
import { ILogger } from "../logger";
import * as Speech from 'ssml-builder';

export class FeatureDisabledIntentHandler implements IVoiceIntentHandler {

    logger: ILogger;

    constructor(logger: ILogger) {
        this.logger = logger;
    }

    async handleIntent(request: IVoiceRequest, response: IVoiceResponse): Promise<IVoiceResponse> {
        let self = this;

        return new Promise<IVoiceResponse>((resolve, reject) => {

            let complexSpeech = <AlexaSpeech>new Speech();
            complexSpeech.say("This feature is currently disabled");

            resolve(response);

        });
    }
}