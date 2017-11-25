
import { Container } from "inversify";
import { IDeviceFactory, RuntimeDeviceFactory } from "./device/device_factory";
import { IVoiceHandlerFactory, RuntimeVoiceHandlerFactory } from "./voice_handler";
import { IMessageHub, MqttMessageHub } from "./message_hub";
import { ConsoleLogger, ILogger } from "./logger";
import { TYPES } from "./types";
import { IDeviceRepo, StaticDeviceRepo } from "./device/device_repo";

const container = new Container();

container.bind<IDeviceRepo>(TYPES.DeviceRepo).to(StaticDeviceRepo).inSingletonScope();
container.bind<IDeviceFactory>(TYPES.DeviceFactory).to(RuntimeDeviceFactory);
container.bind<IVoiceHandlerFactory>(TYPES.VoiceHandlerFactory).to(RuntimeVoiceHandlerFactory);
container.bind<IMessageHub>(TYPES.MessageHub).to(MqttMessageHub);
container.bind<ILogger>(TYPES.Logger).to(ConsoleLogger);

console.log('container setup');
export { container };