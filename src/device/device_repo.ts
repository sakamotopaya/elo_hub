import { container } from "../boot";
import { injectable, inject } from "inversify";
import "reflect-metadata";

import { Container } from "inversify";
import { IDevice, DeviceDescriptor } from "./device";
import { KeyedCollection } from "../utility/dictionary";
import { TYPES } from "../types";
import { IDeviceFactory } from "./device_factory";
import { DeviceConfig, DeviceState } from "../topics/topic_handler_factory";
import { Collection } from "../utility/collection";

export interface IDeviceRepo {
    getDeviceByName(name: string): IDevice;
    updateDeviceConfiguration(name: string, state: DeviceConfig);
    getDeviceState(name: string) : DeviceState;
    updateDeviceState(name: string, state: DeviceState);
    getDeviceConfiguration() : DevicePayload[];
};

class DeviceContext {
    descriptor: DeviceDescriptor;
    config: DeviceConfig;
    state: DeviceState;
};

export class DevicePayload {
    name : string;
    device: DeviceDescriptor;
    config : DeviceConfig;
    state : DeviceState;
};

@injectable()
export class StaticDeviceRepo implements IDeviceRepo {

    private devices: KeyedCollection<DeviceContext>;

    constructor() {
        this.devices = new KeyedCollection<DeviceContext>();

        this.initializeRepo(this.devices);
    }

    initializeRepo(devices: KeyedCollection<DeviceContext>) {

        devices.add('kitchen', <DeviceContext> { descriptor : new DeviceDescriptor('kitchen', 'leds above the cabinet', '192.168.1.114', 8088, 'rest', 'led') });
        devices.add('elo_wb', <DeviceContext> { descriptor : new DeviceDescriptor('whiteboard','office whiteboard','192.168.1.136', 8088, 'mqtt', 'led') });
        devices.add('side table', <DeviceContext> { descriptor : new DeviceDescriptor('side table','living room side table','192.168.1.70', 88, 'rest', 'led') });
        devices.add('elo_test', <DeviceContext> { descriptor : new DeviceDescriptor('elo_test','test_device','192.168.1.136', 8088, 'mqtt', 'led') });
        devices.add('elo_dfmon', <DeviceContext> { descriptor : new DeviceDescriptor('dfmon','dog food scale','192.168.1.136', 8088, 'mqtt', 'led') });
    }

    public getDeviceByName(name: string): IDevice {
        if (this.devices.containsKey(name)) {
            var context : DeviceContext = this.devices.item(name);
            var deviceFactory = container.get<IDeviceFactory>(TYPES.DeviceFactory);
            var device = deviceFactory.getDevice(context.descriptor);
            
            return device;
        }

        return null;
    }

    public updateDeviceConfiguration(name: string, config: DeviceConfig) {
        let context = this.getDeviceContext(name);
        context.config = config;
    }

    public getDeviceState(name: string) : DeviceState {
        let context = this.getDeviceContext(name);
        return context.state;
    }

    public updateDeviceState(name: string, state: DeviceState) {
        let context = this.getDeviceContext(name);
        context.state = state;
    }

    private getDeviceContext(name:string): DeviceContext {
        if (this.devices.containsKey(name)) {
            return this.devices.item(name);
        } else {
            var context = new DeviceContext();
            this.devices.add(name, context);
            return context;
        }
    }

    public getDeviceConfiguration() : DevicePayload[] {
        let deviceList : DevicePayload[] = [];

        for (let key of this.devices.keys()) {
            var context = this.devices.item(key);
            let deviceResponse : DevicePayload = <DevicePayload> 
            { 
                name : key, config : context.config, state: context.state, device : context.descriptor 
            };
            deviceList.push(deviceResponse);
        }
        
        return deviceList;
    }

};
