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
const axios_1 = require("axios");
class ExpressDeviceRelayHandler {
    handle(expressRequest, expressResponse) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('relay: ' + JSON.stringify(expressRequest.body));
            let relayPayload = expressRequest.body;
            let deviceAddress = decodeURIComponent(relayPayload.deviceAddress);
            let devicePayload = relayPayload.payload;
            console.log('relay to : ' + deviceAddress);
            axios_1.default.post(deviceAddress, relayPayload.payload)
                .then(function (axiosResponse) {
                console.log('back from device', JSON.stringify(axiosResponse.data));
                expressResponse.json(axiosResponse.data);
            })
                .catch(function (axiosError) {
                console.log('error calling device' + JSON.stringify(axiosError));
                expressResponse.json({ errorInfo: axiosError });
            });
        });
    }
}
exports.ExpressDeviceRelayHandler = ExpressDeviceRelayHandler;
//# sourceMappingURL=relay_handler.js.map