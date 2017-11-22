import { container } from "../boot";
import { injectable, inject } from "inversify";
import "reflect-metadata";

import { Container } from "inversify";
import { IDevice, DeviceDescriptor } from "./device";
import { KeyedCollection } from "../utility/dictionary";
import { TYPES } from "../types";
import { IDeviceFactory } from "./device_factory";

export interface IDeviceRepo {
    getDeviceByName(name: string): IDevice;
}

@injectable()
export class StaticDeviceRepo implements IDeviceRepo {

    private devices: KeyedCollection<DeviceDescriptor>;

    constructor() {
        this.devices = new KeyedCollection<DeviceDescriptor>();

        this.initializeRepo(this.devices);
    }

    initializeRepo(devices: KeyedCollection<DeviceDescriptor>) {
        devices.add('kitchen', new DeviceDescriptor('192.168.1.114', 8088));
        devices.add('whiteboard', new DeviceDescriptor('192.168.1.124', 8088));
        devices.add('side table', new DeviceDescriptor('192.168.1.70', 88));
    }

    public getDeviceByName(name: string): IDevice {
        if (this.devices.containsKey(name)) {
            var descriptor = this.devices.item(name);
            var deviceFactory = container.get<IDeviceFactory>(TYPES.DeviceFactory);
            var device = deviceFactory.getDevice(descriptor);
            
            return device;
        }

        return null;
    }

}
