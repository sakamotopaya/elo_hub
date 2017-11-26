"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TYPES = {
    DeviceFactory: Symbol("IDeviceFactory"),
    VoiceHandlerFactory: Symbol("IVoiceHandlerFactory"),
    MessageHub: Symbol("IMessageHub"),
    Logger: Symbol("ILogger"),
    Config: Symbol("ISystemConfig"),
    ExpressApp: Symbol("IExpressApp"),
    DeviceRepo: Symbol("IDeviceRepo")
};
exports.TYPES = TYPES;
const inversify_1 = require("inversify");
const device_factory_1 = require("./device/device_factory");
const voice_handler_1 = require("./voice_handler");
const message_hub_1 = require("./message_hub");
const logger_1 = require("./logger");
const myContainer = new inversify_1.Container();
exports.myContainer = myContainer;
myContainer.bind(TYPES.DeviceFactory).to(device_factory_1.RuntimeDeviceFactory);
myContainer.bind(TYPES.VoiceHandlerFactory).to(voice_handler_1.AlexaVoiceHandler);
myContainer.bind(TYPES.MessageHub).to(message_hub_1.MqttMessageHub);
myContainer.bind(TYPES.Logger).to(logger_1.ConsoleLogger);
//# sourceMappingURL=types.js.map