import { injectable, inject } from "inversify";
import "reflect-metadata";

import * as mqtt from 'mqtt';
import { MqttClient, ISubscriptionGrant } from 'mqtt';
import { ILogger } from './logger';
import { IDeviceFactory } from './device/device_factory';
import { TYPES } from "./types";
import { ISystemConfig } from "./utility/utility";
import { IDeviceRepo } from "./device/device_repo";
import { DeviceNames } from "./device/device";
import { ITopicHandlerFactory } from "./topics/topic_handler_factory";
import { IndicatorStatus } from "./indicator/indicator_repo";

export interface IMessageHub {
    sendMessage(device: string, subject: string, message: string) ;
    broadcastIndicatorStatus(device: string, status: IndicatorStatus) : void
}

export interface IMessageHubConfig {
    hubUrl: string;
    listenerDisabled: boolean;
    listenerPattern: string;
}

@injectable()
export class MqttMessageHub implements IMessageHub {

    private logger: ILogger;
    private config: IMessageHubConfig;
    private mqttClient: MqttClient;
    private deviceRepo: IDeviceRepo;
    private topicHandlerFactory: ITopicHandlerFactory;

    constructor( @inject(TYPES.Logger) logger: ILogger,
        @inject(TYPES.DeviceRepo) deviceRepo: IDeviceRepo,
        @inject(TYPES.Config) systemConfig: ISystemConfig,
        @inject(TYPES.TopicHandlerFactory) topicHandlerFactory : ITopicHandlerFactory) {

        this.logger = logger;
        this.config = <IMessageHubConfig>systemConfig.messaging;
        this.mqttClient = mqtt.connect(this.config.hubUrl);
        this.deviceRepo = deviceRepo;
        this.topicHandlerFactory = topicHandlerFactory;

        this.initialize(this.logger);
    }

    public broadcastIndicatorStatus(device: string, status: IndicatorStatus) : void {
        this.sendMessage(device, 'update', JSON.stringify(status));
    }

    public sendMessage(device: string, subject: string, message: string) {
        let topic: string = 'elo/' + device + '/' + subject;
        this.mqttClient.publish(topic, message);
    }

    private initialize(logger: ILogger): void {
        let client: MqttClient = this.mqttClient;
        let self: MqttMessageHub = this;

        client.on('connect', function () {
            if (!self.config.listenerDisabled)
                client.subscribe(self.config.listenerPattern);
        })

        client.on('message', async function (topic: string, payload: string) {

            let handler = self.topicHandlerFactory.getHandlerForTopic(topic);
            handler.handleMessage(topic, payload);

        });

    }
}
