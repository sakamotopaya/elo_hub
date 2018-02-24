"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const device_factory_1 = require("../src/device/device_factory");
const voice_handler_1 = require("../src/voice/voice_handler");
const logger_1 = require("../src/logger");
const types_1 = require("../src/types");
const mock_message_hub_1 = require("./mocks/mock_message_hub");
const device_repo_1 = require("../src/device/device_repo");
const container = new inversify_1.Container();
exports.container = container;
container.bind(types_1.TYPES.DeviceRepo).to(device_repo_1.StaticDeviceRepo).inSingletonScope();
container.bind(types_1.TYPES.DeviceFactory).to(device_factory_1.RuntimeDeviceFactory);
container.bind(types_1.TYPES.VoiceHandlerFactory).to(voice_handler_1.AlexaVoiceHandler);
container.bind(types_1.TYPES.MessageHub).to(mock_message_hub_1.MockMessageHub);
container.bind(types_1.TYPES.Logger).to(logger_1.ConsoleLogger);
//# sourceMappingURL=boot.js.map