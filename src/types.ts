const TYPES = {
    DeviceFactory: Symbol("IDeviceFactory"),
    VoiceHandlerFactory: Symbol("IVoiceHandlerFactory"),
    MessageHub: Symbol("IMessageHub"),
    Logger: Symbol("ILogger"),
    Config: Symbol("ISystemConfig"),
    ExpressApp: Symbol("IExpressApp"),
    DeviceRepo: Symbol("IDeviceRepo")
};

import { Container } from "inversify";
import { IDeviceFactory, RuntimeDeviceFactory } from "./device/device_factory";
import { IVoiceHandler, AlexaVoiceHandler } from "./voice_handler";
import { IMessageHub, MqttMessageHub } from "./message_hub";
import { ConsoleLogger, ILogger } from "./logger";

const myContainer = new Container();
myContainer.bind<IDeviceFactory>(TYPES.DeviceFactory).to(RuntimeDeviceFactory);
myContainer.bind<IVoiceHandler>(TYPES.VoiceHandlerFactory).to(AlexaVoiceHandler);
myContainer.bind<IMessageHub>(TYPES.MessageHub).to(MqttMessageHub);
myContainer.bind<ILogger>(TYPES.Logger).to(ConsoleLogger);

export { myContainer, TYPES };
