
import { injectable, inject } from "inversify";
import "reflect-metadata";
import axios from 'axios';

export class DeviceNames {
    public static kitchen: string = 'kitchen';
    public static whiteboard: string = 'elo_wb';
    public static sideTable: string = 'sidetable';
}

export class DeviceDescriptor {

    public address: string;
    public port: number;
    public connectionType: string;
    public deviceClass: string;
    public description: string;
    public name: string;
    constructor(deviceName: string, description: string, address: string, port: number, connectionType: string, deviceClass: string) {
        this.address = address;
        this.port = port;
        this.connectionType = connectionType;
        this.deviceClass = deviceClass;
        this.name = deviceName;
        this.description = description;
    }
}

export interface IDevice {
    updateIndicator(indicatorId: number, status: number, level: number): Promise<void>;
    setOn(): Promise<void>;
    setOff(): Promise<void>;
}

export class AxiosDevice implements IDevice {

    private url: string;
    private port: number;

    constructor(url: string, port: number) {
        this.url = url;
        this.port = port;
    }

    async updateIndicator(indicatorId: number, status: number, level: number): Promise<void> {
        var url = "http://" + this.url + ":" + this.port + '/api/dev_indicator';

        var indicatorRequest =
            {
                url: url,
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                data: { indicatorId: indicatorId, status: status, level: level }
            };

        await axios(indicatorRequest);
    }

    async setOn(): Promise<void> {
        var fullUrl = "http://" + this.url + ':' + this.port + '/api/dev_on';
        await axios.post(fullUrl, { brightness: 100 });
    }

    async setOff(): Promise<void> {
        var fullUrl = "http://" + this.url + ':' + this.port + '/api/dev_off';
        await axios.post(fullUrl, { brightness: 100 });
    }
}

