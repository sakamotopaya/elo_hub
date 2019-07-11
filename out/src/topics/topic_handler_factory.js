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
const types_1 = require("../types");
class DeviceConfigHandler {
    constructor(deviceName, deviceRepo) {
        this.deviceRepo = deviceRepo;
        this.deviceName = deviceName;
    }
    handleMessage(topic, message) {
        let state = JSON.parse(message);
        this.deviceRepo.updateDeviceConfiguration(this.deviceName, state);
    }
}
class DeviceStateHandler {
    constructor(deviceName, deviceRepo, rulesEngine) {
        this.deviceRepo = deviceRepo;
        this.deviceName = deviceName;
        this.rulesEngine = rulesEngine;
    }
    handleMessage(topic, message) {
        let self = this;
        let state = JSON.parse(message);
        this.deviceRepo.updateDeviceState(this.deviceName, state);
        let actions = this.rulesEngine.processDeviceStateChange(this.deviceName);
        actions.forEach(action => {
            action.invoke();
        });
    }
}
exports.DeviceStateHandler = DeviceStateHandler;
class NullTopicHandler {
    handleMessage(name, message) {
        console.log('null topic handler selected for topic ' + name + '. this message was missed:');
        console.log(message);
    }
}
;
;
;
let TopicHandlerFactory = class TopicHandlerFactory {
    constructor(logger, deviceRepo, rulesEngine, systemConfig) {
        this.logger = logger;
        this.rulesEngine = rulesEngine;
        this.config = systemConfig;
        this.deviceRepo = deviceRepo;
    }
    getHandlerForTopic(topic) {
        let deviceName = this.getDeviceName(topic);
        if (topic.startsWith('elo') && topic.endsWith('/config'))
            return new DeviceConfigHandler(deviceName, this.deviceRepo);
        else if (topic.startsWith('elo') && topic.endsWith('/state'))
            return new DeviceStateHandler(deviceName, this.deviceRepo, this.rulesEngine);
        return new NullTopicHandler();
    }
    getDeviceName(topic) {
        let parts = topic.split('/');
        return parts[1];
    }
};
TopicHandlerFactory = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.Logger)),
    __param(1, inversify_1.inject(types_1.TYPES.DeviceRepo)),
    __param(2, inversify_1.inject(types_1.TYPES.IndicatorRulesEngine)),
    __param(3, inversify_1.inject(types_1.TYPES.Config)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], TopicHandlerFactory);
exports.TopicHandlerFactory = TopicHandlerFactory;
//# sourceMappingURL=topic_handler_factory.js.map