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
Object.defineProperty(exports, "__esModule", { value: true });
const boot_1 = require("../boot");
const inversify_1 = require("inversify");
require("reflect-metadata");
const device_1 = require("./device");
const dictionary_1 = require("../utility/dictionary");
const types_1 = require("../types");
;
class DeviceContext {
}
;
class DevicePayload {
}
exports.DevicePayload = DevicePayload;
;
let StaticDeviceRepo = class StaticDeviceRepo {
    constructor() {
        this.devices = new dictionary_1.KeyedCollection();
        this.initializeRepo(this.devices);
    }
    initializeRepo(devices) {
        devices.add('kitchen', {
            descriptor: new device_1.DeviceDescriptor('kitchen', 'leds above the cabinet', '192.168.1.114', 8088, 'rest', 'led'),
            profile: {
                applianceId: 'kitchen',
                manufacturerName: 'ELO Home',
                modelName: 'Kitchen',
                version: '1.0',
                friendlyName: 'Kitchen',
                friendlyDescription: "Kitchen mood lighting",
                isReachable: true,
                actions: ['turnOn', 'turnOff', 'setPercentage', 'incrementPercentage', 'decrementPercentage'],
                additionalApplianceDetails: {}
            }
        });
        devices.add('elo_wb', {
            descriptor: new device_1.DeviceDescriptor('elo_wb', 'office whiteboard', '192.168.1.136', 8088, 'mqtt', 'led'),
            profile: {
                applianceId: 'whiteboard',
                manufacturerName: 'ELO Home',
                modelName: 'Whiteboard',
                version: '1.0',
                friendlyName: 'Whiteboard',
                friendlyDescription: "sakamoto's whiteboard",
                isReachable: true,
                actions: ['turnOn', 'turnOff', 'setPercentage', 'incrementPercentage', 'decrementPercentage'],
                additionalApplianceDetails: {}
            }
        });
        devices.add('side table', {
            descriptor: new device_1.DeviceDescriptor('side table', 'living room side table', '192.168.1.70', 88, 'rest', 'led'),
            profile: {
                applianceId: 'sidetable',
                manufacturerName: 'ELO Home',
                modelName: 'SideTable',
                version: '1.0',
                friendlyName: 'Side Table',
                friendlyDescription: "Side table",
                isReachable: true,
                actions: ['turnOn', 'turnOff', 'setPercentage', 'incrementPercentage', 'decrementPercentage'],
                additionalApplianceDetails: {}
            }
        });
        devices.add('elo_test', { descriptor: new device_1.DeviceDescriptor('elo_test', 'test_device', '192.168.1.136', 8088, 'mqtt', 'led') });
        devices.add('elo_dfmon', { descriptor: new device_1.DeviceDescriptor('elo_dfmon', 'dog food scale', '192.168.1.136', 8088, 'mqtt', 'led') });
    }
    getDeviceByName(name) {
        if (this.devices.containsKey(name)) {
            var context = this.devices.item(name);
            var deviceFactory = boot_1.container.get(types_1.TYPES.DeviceFactory);
            var device = deviceFactory.getDevice(context.descriptor);
            return device;
        }
        return null;
    }
    updateDeviceConfiguration(name, config) {
        let context = this.getDeviceContext(name);
        context.config = config;
    }
    getDeviceState(name) {
        let context = this.getDeviceContext(name);
        return context.state;
    }
    updateDeviceState(name, state) {
        let context = this.getDeviceContext(name);
        context.state = state;
    }
    getDeviceContext(name) {
        if (this.devices.containsKey(name)) {
            return this.devices.item(name);
        }
        else {
            var context = new DeviceContext();
            this.devices.add(name, context);
            return context;
        }
    }
    getDeviceConfiguration() {
        let deviceList = [];
        for (let key of this.devices.keys()) {
            var context = this.devices.item(key);
            let deviceResponse = {
                name: key, config: context.config, state: context.state, device: context.descriptor
            };
            deviceList.push(deviceResponse);
        }
        return deviceList;
    }
    getDeviceProfiles() {
        let deviceList = [];
        for (let key of this.devices.keys()) {
            var context = this.devices.item(key);
            deviceList.push(context.profile);
        }
        return deviceList;
    }
};
StaticDeviceRepo = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [])
], StaticDeviceRepo);
exports.StaticDeviceRepo = StaticDeviceRepo;
;
//# sourceMappingURL=device_repo.js.map