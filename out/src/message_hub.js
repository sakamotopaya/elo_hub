"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
require("reflect-metadata");
const mqtt = require("mqtt");
const types_1 = require("./types");
const device_1 = require("./device/device");
let MqttMessageHub = class MqttMessageHub {
    constructor(logger, deviceRepo, systemConfig) {
        this.logger = logger;
        this.config = systemConfig.messaging;
        this.mqttClient = mqtt.connect('mqtt://192.168.1.168');
        this.deviceRepo = deviceRepo;
        this.initialize(this.logger);
    }
    initialize(logger) {
        let client = this.mqttClient;
        let self = this;
        client.on('connect', function () {
            client.subscribe('indicator_state');
        });
        client.on('message', function (topic, payload) {
            if (topic === "indicator_state") {
                var indicatorStatus = JSON.parse(payload.toString());
                self.logger.log(indicatorStatus);
                var device = self.deviceRepo.getDeviceByName(device_1.DeviceNames.whiteboard);
                var result = device.updateIndicator(indicatorStatus.indicatorId, indicatorStatus.status, indicatorStatus.level);
                result.then(() => {
                    console.log("message sent");
                }).catch((e) => {
                    console.error(e);
                });
            }
            self.logger.log(payload.toString());
        });
    }
};
MqttMessageHub = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.Logger)),
    __param(1, inversify_1.inject(types_1.TYPES.DeviceRepo)),
    __param(2, inversify_1.inject(types_1.TYPES.Config)),
    __metadata("design:paramtypes", [Object, Object, Object])
], MqttMessageHub);
exports.MqttMessageHub = MqttMessageHub;
class IndicatorStatus {
}
//# sourceMappingURL=message_hub.js.map