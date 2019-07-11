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
const fs = require("fs");
const filewatcher = require("filewatcher");
const path = require("path");
const boot_1 = require("../boot");
const inversify_1 = require("inversify");
require("reflect-metadata");
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
class Device {
}
let StaticDeviceRepo = class StaticDeviceRepo {
    constructor(logger, systemConfig) {
        this.config = systemConfig.deviceRepo;
        this.initializeRepo();
        this.watchRepo();
    }
    watchRepo() {
        let that = this;
        let repoPath = path.join(this.config.repoPath, 'device_repo.json');
        let watcher = filewatcher();
        watcher.add(repoPath);
        watcher.on('change', function (file, stat) {
            console.log('Device repo changed, reloading...');
            that.initializeRepo();
        });
    }
    initializeRepo() {
        let self = this;
        this.devices = new dictionary_1.KeyedCollection();
        let repoPath = path.join(this.config.repoPath, 'device_repo.json');
        let deviceStore = JSON.parse(fs.readFileSync(repoPath).toString());
        deviceStore.forEach(device => {
            this.devices.add(device.name, device.context);
        });
        // this.dumpRepo();
    }
    dumpRepo() {
        let dump = [];
        for (let key of this.devices.keys()) {
            let outModel = { name: key, context: this.devices.item(key) };
            dump.push(outModel);
        }
        let repoBuf = JSON.stringify(dump);
        fs.writeFileSync('sample_files/repo.json', repoBuf);
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
            if (context.descriptor) {
                let state = context.state === undefined ? {} : context.state;
                let deviceResponse = {
                    name: key, config: context.config, state: state, device: context.descriptor
                };
                deviceList.push(deviceResponse);
            }
        }
        return deviceList;
    }
    getDeviceProfiles() {
        let deviceList = [];
        for (let key of this.devices.keys()) {
            var context = this.devices.item(key);
            if (context.profile !== undefined)
                deviceList.push(context.profile);
        }
        return deviceList;
    }
};
StaticDeviceRepo = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.Logger)),
    __param(1, inversify_1.inject(types_1.TYPES.Config)),
    __metadata("design:paramtypes", [Object, Object])
], StaticDeviceRepo);
exports.StaticDeviceRepo = StaticDeviceRepo;
;
//# sourceMappingURL=device_repo.js.map