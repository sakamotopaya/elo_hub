"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const device_factory_1 = require("./device/device_factory");
const voice_handler_1 = require("./voice_handler");
const message_hub_1 = require("./message_hub");
const logger_1 = require("./logger");
const types_1 = require("./types");
const device_repo_1 = require("./device/device_repo");
const container = new inversify_1.Container();
exports.container = container;
container.bind(types_1.TYPES.DeviceRepo).to(device_repo_1.StaticDeviceRepo).inSingletonScope();
container.bind(types_1.TYPES.DeviceFactory).to(device_factory_1.RuntimeDeviceFactory);
container.bind(types_1.TYPES.VoiceHandlerFactory).to(voice_handler_1.RuntimeVoiceHandlerFactory);
container.bind(types_1.TYPES.MessageHub).to(message_hub_1.MqttMessageHub);
container.bind(types_1.TYPES.Logger).to(logger_1.ConsoleLogger);
console.log('container setup');
//# sourceMappingURL=boot.js.map