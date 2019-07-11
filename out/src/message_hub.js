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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
require("reflect-metadata");
const mqtt = require("mqtt");
const types_1 = require("./types");
let MqttMessageHub = class MqttMessageHub {
    constructor(logger, deviceRepo, systemConfig, topicHandlerFactory) {
        this.logger = logger;
        this.config = systemConfig.messaging;
        this.mqttClient = mqtt.connect(this.config.hubUrl);
        this.deviceRepo = deviceRepo;
        this.topicHandlerFactory = topicHandlerFactory;
        this.initialize(this.logger);
    }
    broadcastIndicatorStatus(device, status) {
        this.sendMessage(device, 'update', JSON.stringify(status));
    }
    sendMessage(device, subject, message) {
        let topic = 'elo/' + device + '/' + subject;
        this.mqttClient.publish(topic, message);
    }
    initialize(logger) {
        let client = this.mqttClient;
        let self = this;
        client.on('connect', function () {
            if (!self.config.listenerDisabled)
                client.subscribe(self.config.listenerPattern);
        });
        client.on('message', function (topic, payload) {
            return __awaiter(this, void 0, void 0, function* () {
                let handler = self.topicHandlerFactory.getHandlerForTopic(topic);
                handler.handleMessage(topic, payload);
            });
        });
    }
};
MqttMessageHub = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.Logger)),
    __param(1, inversify_1.inject(types_1.TYPES.DeviceRepo)),
    __param(2, inversify_1.inject(types_1.TYPES.Config)),
    __param(3, inversify_1.inject(types_1.TYPES.TopicHandlerFactory)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], MqttMessageHub);
exports.MqttMessageHub = MqttMessageHub;
//# sourceMappingURL=message_hub.js.map