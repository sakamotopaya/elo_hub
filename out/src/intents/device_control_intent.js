"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const utility_1 = require("../utility/utility");
class DeviceControlIntentHandler {
    constructor(logger, deviceFactory) {
        this.deviceFactory = deviceFactory;
        this.logger = logger;
    }
    handleIntent(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                var unprocessedName = request.slot("device_name");
                var deviceState = request.slot("device_state");
                this.logger.log(unprocessedName);
                var deviceName = utility_1.Utility.unprocessedNameToDeviceName(unprocessedName);
                var device = this.deviceFactory.getDeviceByName(deviceName);
                if (device === null) {
                    response.say("I don't recognize " + unprocessedName + " as a valid device.");
                    resolve(response);
                    return;
                }
                try {
                    if (deviceState === "off")
                        yield device.setOff();
                    else if (deviceState === "on")
                        yield device.setOn();
                    response.say("done!");
                    resolve(response);
                }
                catch (e) {
                    console.error(e);
                    reject(response);
                }
            }));
        });
    }
}
exports.DeviceControlIntentHandler = DeviceControlIntentHandler;
//# sourceMappingURL=device_control_intent.js.map