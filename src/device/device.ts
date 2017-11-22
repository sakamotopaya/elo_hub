
import { injectable, inject } from "inversify";
import "reflect-metadata";
import axios from 'axios';

export class DeviceNames {
    public static kitchen: string = 'kitchen';
    public static whiteboard: string = 'whiteboard';
    public static sideTable: string = 'sidetable';
}

export class DeviceDescriptor {

    public url: string;
    public port: number;

    constructor(url: string, port: number) {
        this.url = url;
        this.port = port;
    }
}

export interface IDevice {
    updateIndicator(indicatorId: number, status: number, level: number): void;
    setOn(): Promise<any>;
    setOff(): Promise<any>;
}

export class AxiosDevice implements IDevice {

    private url: string;
    private port: number;

    constructor(url: string, port: number) {
        this.url = url;
        this.port = port;
    }

    async updateIndicator(indicatorId: number, status: number, level: number): Promise<any> {
        var url = this.url + ":" + this.port + '/api/dev_indicator';

        var indicatorRequest =
            {
                url: url,
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                data: { indicatorId: indicatorId, status: status, level: level }
            };

        await axios(indicatorRequest);
    }

    async setOn(): Promise<any> {
        var fullUrl = this.url + ':' + this.port + '/api/dev_on';
        await axios.post(fullUrl, { brightness: 100 });

        // .then(function (response) {
        //   response.say("Done!");
        // })
        // .catch(function (error) {
        //   response.say(Messages.StockErrorMessage);
        // });
    }

    async setOff(): Promise<any> {
        var fullUrl = this.url + ':' + this.port + '/api/dev_off';
        await axios.post(fullUrl, { brightness: 100 });

        // .then(function (response) {
        //   response.say("Done!");
        // })
        // .catch(function (error) {
        //   response.say(Messages.StockErrorMessage);
        // });
    }
}

