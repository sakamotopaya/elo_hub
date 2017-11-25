import { injectable, inject } from "inversify";
import "reflect-metadata";

import * as mqtt from 'mqtt';
import { MqttClient } from 'mqtt';
import { ILogger } from './logger';
import { IDeviceFactory } from './device/device_factory';
import { TYPES } from "./types";
import { ISystemConfig } from "./utility/utility";
import { IDeviceRepo } from "./device/device_repo";
import { DeviceNames } from "./device/device";

export interface IMessageHub {

}

export interface IMessageHubConfig {
    hubUrl: string;
}

@injectable()
export class MqttMessageHub implements IMessageHub {

    private logger: ILogger;
    private config: IMessageHubConfig;
    private mqttClient: MqttClient;
    private deviceRepo: IDeviceRepo;

    constructor( @inject(TYPES.Logger) logger: ILogger,
        @inject(TYPES.DeviceRepo) deviceRepo: IDeviceRepo,
        @inject(TYPES.Config) systemConfig: ISystemConfig) {
        this.logger = logger;
        this.config = <IMessageHubConfig>systemConfig.messaging;
        this.mqttClient = mqtt.connect('mqtt://192.168.1.168');
        this.deviceRepo = deviceRepo;

        this.initialize(this.logger);
    }

    private initialize(logger: ILogger): void {
        let client: MqttClient = this.mqttClient;
        let self: MqttMessageHub = this;

        client.on('connect', function () {
            client.subscribe('indicator_state');
        })

        client.on('message', function (topic, payload) {

            if (topic === "indicator_state") {

                var indicatorStatus: IndicatorStatus = JSON.parse(payload.toString());
                self.logger.log(indicatorStatus);

                var device = self.deviceRepo.getDeviceByName(DeviceNames.whiteboard);
                var result = device.updateIndicator(indicatorStatus.indicatorId, indicatorStatus.status, indicatorStatus.level);
                result.then(() => {
                    console.log("message sent");
                }).catch((e) => {
                    console.error(e);
                });
            }

            self.logger.log(payload.toString())
        })
    }
}

class IndicatorStatus {
    indicatorId: number;
    status: number;
    level: number;
}