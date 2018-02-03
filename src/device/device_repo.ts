import * as fs from 'fs';
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
import { ILogger } from '../logger';
import { ISystemConfig } from '../utility/utility';

export interface IDeviceRepo {
    getDeviceByName(name: string): IDevice;
    updateDeviceConfiguration(name: string, state: DeviceConfig);
    getDeviceState(name: string): DeviceState;
    updateDeviceState(name: string, state: DeviceState);
    getDeviceConfiguration(): DevicePayload[];
    getDeviceProfiles(): DeviceProfile[];
};

export interface IDeviceRepoConfig {
    repoPath: string;
}

export interface DeviceProfile {
    applianceId: string,
    manufacturerName: string,
    modelName: string,
    version: '1.0',
    friendlyName: string,
    friendlyDescription: string,
    isReachable: true,
    actions: string[],
    additionalApplianceDetails: any
    ;
}

class DeviceContext {
    descriptor: DeviceDescriptor;
    config: DeviceConfig;
    state: DeviceState;
    profile: DeviceProfile;
};

export class DevicePayload {
    name: string;
    device: DeviceDescriptor;
    config: DeviceConfig;
    state: DeviceState;
};

class Device {
    name: string;
    context: DeviceContext;
}

@injectable()
export class StaticDeviceRepo implements IDeviceRepo {

    private devices: KeyedCollection<DeviceContext>;
    private config: IDeviceRepoConfig;

    constructor( @inject(TYPES.Logger) logger: ILogger,
        @inject(TYPES.Config) systemConfig: ISystemConfig) {

        this.config = systemConfig.deviceRepo;

        this.initializeRepo(this.devices);
    }

    initializeRepo(devices: KeyedCollection<DeviceContext>) {
        let self = this;
        this.devices = new KeyedCollection<DeviceContext>();

        let repoPath = this.config.repoPath + '/device_repo.json';
        let deviceStore = <Device[]> JSON.parse( fs.readFileSync(repoPath).toString());

        deviceStore.forEach(device => {
            this.devices.add(device.name, device.context );
        });

        /*devices.add('kitchen', <DeviceContext>
            {
                descriptor: new DeviceDescriptor('kitchen', 'leds above the cabinet', '192.168.1.114', 8088, 'rest', 'led'),
                profile: <DeviceProfile>{
                    applianceId: 'kitchen',
                    manufacturerName: 'ELO Home',
                    modelName: 'Kitchen',
                    version: '1.0',
                    friendlyName: 'Kitchen',
                    friendlyDescription: "Kitchen mood lighting",
                    isReachable: true,
                    actions: ['turnOn', 'turnOff', 'setPercentage', 'incrementPercentage', 'decrementPercentage'],

                    additionalApplianceDetails: {
                    }
                }
            });

        devices.add('elo_wb', <DeviceContext>
            {
                descriptor: new DeviceDescriptor('elo_wb', 'office whiteboard', '192.168.1.136', 8088, 'mqtt', 'led'),
                profile: <DeviceProfile>{
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
        devices.add('side table', <DeviceContext>
            {
                descriptor: new DeviceDescriptor('side table', 'living room side table', '192.168.1.70', 88, 'rest', 'led'),
                profile: <DeviceProfile>{
                    applianceId: 'sidetable',
                    manufacturerName: 'ELO Home',
                    modelName: 'SideTable',
                    version: '1.0',
                    friendlyName: 'Side Table',
                    friendlyDescription: "Side table",
                    isReachable: true,
                    actions: ['turnOn', 'turnOff', 'setPercentage', 'incrementPercentage', 'decrementPercentage'],

                    additionalApplianceDetails: {
                    }
                }
            });
        devices.add('elo_test', <DeviceContext>{ descriptor: new DeviceDescriptor('elo_test', 'test_device', '192.168.1.136', 8088, 'mqtt', 'led') });
        devices.add('elo_dfmon', <DeviceContext>{ descriptor: new DeviceDescriptor('elo_dfmon', 'dog food scale', '192.168.1.136', 8088, 'mqtt', 'led') });

        this.dumpRepo();*/
    }

    private dumpRepo() {
        let dump = [];
        for (let key of this.devices.keys()) {
            let outModel = <Device>{ name: key, context: this.devices.item(key) };
            dump.push(outModel);
        }

        let repoBuf = JSON.stringify(dump);
        fs.writeFileSync('sample_files/repo.json', repoBuf);
    }

    public getDeviceByName(name: string): IDevice {
        if (this.devices.containsKey(name)) {
            var context: DeviceContext = this.devices.item(name);
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

    public getDeviceState(name: string): DeviceState {
        let context = this.getDeviceContext(name);
        return context.state;
    }

    public updateDeviceState(name: string, state: DeviceState) {
        let context = this.getDeviceContext(name);
        context.state = state;
    }

    private getDeviceContext(name: string): DeviceContext {
        if (this.devices.containsKey(name)) {
            return this.devices.item(name);
        } else {
            var context = new DeviceContext();
            this.devices.add(name, context);
            return context;
        }
    }

    public getDeviceConfiguration(): DevicePayload[] {
        let deviceList: DevicePayload[] = [];

        for (let key of this.devices.keys()) {
            var context = this.devices.item(key);
            let deviceResponse: DevicePayload = <DevicePayload>
                {
                    name: key, config: context.config, state: context.state, device: context.descriptor
                };
            deviceList.push(deviceResponse);
        }

        return deviceList;
    }

    public getDeviceProfiles(): DeviceProfile[] {
        let deviceList: DeviceProfile[] = [];

        for (let key of this.devices.keys()) {
            var context = this.devices.item(key);

            if (context.profile !== undefined)
                deviceList.push(context.profile);
        }

        return deviceList;
    }
};
