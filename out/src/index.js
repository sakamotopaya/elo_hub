"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const boot_1 = require("./boot");
const App_1 = require("./App");
const types_1 = require("./types");
const port = parseInt(process.env.PORT) || 3000;
var config = {
    messaging: {
        hubUrl: 'mqtt://192.168.1.168'
    }
};
boot_1.container.bind(types_1.TYPES.Config).toConstantValue(config);
// const logger = container.get<ILogger>(TYPES.Logger);
// const deviceFactory = container.get<IDeviceFactory>(TYPES.DeviceFactory);
// const voiceHandlerFactory = container.get<IVoiceHandlerFactory>(TYPES.VoiceHandler);
// const messageHub = container.get<IMessageHub>(TYPES.MessageHub);
const app = new App_1.App();
app.run(port);
//# sourceMappingURL=index.js.map