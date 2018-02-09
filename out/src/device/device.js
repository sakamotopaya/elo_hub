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
require("reflect-metadata");
const axios_1 = require("axios");
class DeviceNames {
}
DeviceNames.kitchen = 'kitchen';
DeviceNames.whiteboard = 'elo_wb';
DeviceNames.sideTable = 'sidetable';
exports.DeviceNames = DeviceNames;
class DeviceIndicator {
}
exports.DeviceIndicator = DeviceIndicator;
;
class DeviceDescriptor {
}
exports.DeviceDescriptor = DeviceDescriptor;
class AxiosDevice {
    constructor(url, port) {
        this.url = url;
        this.port = port;
    }
    updateIndicator(indicatorId, status, level) {
        return __awaiter(this, void 0, void 0, function* () {
            var url = "http://" + this.url + ":" + this.port + '/api/dev_indicator';
            var indicatorRequest = {
                url: url,
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                data: { indicatorId: indicatorId, status: status, level: level }
            };
            yield axios_1.default(indicatorRequest);
        });
    }
    setOn() {
        return __awaiter(this, void 0, void 0, function* () {
            var fullUrl = "http://" + this.url + ':' + this.port + '/api/dev_on';
            yield axios_1.default.post(fullUrl, { brightness: 100 });
        });
    }
    setOff() {
        return __awaiter(this, void 0, void 0, function* () {
            var fullUrl = "http://" + this.url + ':' + this.port + '/api/dev_off';
            yield axios_1.default.post(fullUrl, { brightness: 100 });
        });
    }
}
exports.AxiosDevice = AxiosDevice;
//# sourceMappingURL=device.js.map