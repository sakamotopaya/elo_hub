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
let StaticDeviceRepo = class StaticDeviceRepo {
    constructor() {
        this.devices = new dictionary_1.KeyedCollection();
        this.initializeRepo(this.devices);
    }
    initializeRepo(devices) {
        devices.add('kitchen', new device_1.DeviceDescriptor('192.168.1.114', 8088));
        devices.add('whiteboard', new device_1.DeviceDescriptor('192.168.1.136', 8088));
        devices.add('side table', new device_1.DeviceDescriptor('192.168.1.70', 88));
    }
    getDeviceByName(name) {
        if (this.devices.containsKey(name)) {
            var descriptor = this.devices.item(name);
            var deviceFactory = boot_1.container.get(types_1.TYPES.DeviceFactory);
            var device = deviceFactory.getDevice(descriptor);
            return device;
        }
        return null;
    }
};
StaticDeviceRepo = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [])
], StaticDeviceRepo);
exports.StaticDeviceRepo = StaticDeviceRepo;
//# sourceMappingURL=device_repo.js.map