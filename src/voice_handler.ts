import { injectable, inject } from "inversify";
import "reflect-metadata";

import * as express from 'express';
import * as fs from 'fs';
import { exec } from 'child_process'

import { app, ErrorHandler } from 'alexa-app';
import { ILogger } from './logger';
import { Messages, Utility, ISystemConfig } from './utility/utility';
import { IDeviceFactory } from './device/device_factory';
import { DeviceControlIntentHandler, IVoiceRequest, IVoiceResponse } from './intents/device_control_intent';
import { TYPES } from "./types";
import { IDeviceRepo } from "./device/device_repo";
import { AlexaLaunchHandler } from "./intents/alexa_launch_handler";
import { BuildIntentHandler } from "./intents/build_intent";
import { QueueBuildIntentHandler } from "./intents/queue_build_intent";
import { ActiveTasksIntentHandler } from "./intents/active_tasks_intent";
import { runInThisContext } from "vm";

//var alexa = require("alexa-app");

export interface IVoiceHandler {

}

export class AlexaVoiceHandler implements IVoiceHandler {

  private alexaApp: app;
  private logger: ILogger;
  private deviceRepo: IDeviceRepo;
  private config: ISystemConfig;

  constructor( @inject(TYPES.Logger) logger: ILogger,
    @inject(TYPES.DeviceRepo) deviceRepo: IDeviceRepo,
    @inject(TYPES.ExpressApp) expressApp: any,
    @inject(TYPES.Config) config: ISystemConfig) {

    this.alexaApp = new app("alexa");
    this.logger = logger;
    this.deviceRepo = deviceRepo;
    this.config = config;

    this.alexaApp.express({
      expressApp: expressApp,
      checkCert: false,
      debug: true
    });

    this.initialize();
  }

  private initialize(): void {

    var self = this;
    var logger = this.logger;

    this.alexaApp.launch((request: IVoiceRequest, response: IVoiceResponse) => {
      try {
        var intent = new AlexaLaunchHandler(this.logger, this.deviceRepo);
        return intent.handleIntent(request, response);
      } catch (e) {
        logger.error(e);
      }
    });

    this.alexaApp.intent("DeviceControlIntent", {
      "slots": {},
      "utterances": [
        "to turn on|off the device"
      ]
    }, (request: IVoiceRequest, response: IVoiceResponse) => {
      try {
        var intent = new DeviceControlIntentHandler(this.logger, this.deviceRepo);
        return intent.handleIntent(request, response);
      } catch (e) {
        logger.error(e);
      }
    });

    this.alexaApp.intent("BuildIntent", {
      "slots": {},
      "utterances": [
        "to check on the build"
        , "to get the status of the build"
        , "to get the build status"
      ]
    }, (request: IVoiceRequest, response: IVoiceResponse) => {
      try {
        var intent = new BuildIntentHandler(this.logger, this.deviceRepo, this.config);
        return intent.handleIntent(request, response);
      } catch (e) {
        logger.error(e);
        response.say(e);
      }
    });

    this.alexaApp.intent("QueueBuildIntent", {
      "slots": {},
      "utterances": [
        "to queue a build"
        , "to run a build"
        , "start a build"
      ]
    },       (request: IVoiceRequest, response: IVoiceResponse) => {
        try {
          var intent = new QueueBuildIntentHandler(this.logger, this.deviceRepo, this.config);
          return intent.handleIntent(request, response);
        } catch (e) {
          logger.error(e);
        }
      });

    this.alexaApp.intent("AnimationIntent", {
      "slots": {},
      "utterances": [
        "to change the device animation"
      ]
    },      (request: IVoiceRequest, response: IVoiceResponse) => {
      try {
        var intent = new QueueBuildIntentHandler(this.logger, this.deviceRepo, this.config);
        return intent.handleIntent(request, response);
      } catch (e) {
        logger.error(e);
      }
    });

    this.alexaApp.intent("ActiveTasksIntent", {
      "slots": {},
      "utterances": [
        "to list my active tasks"
      ]
    }, async (request: IVoiceRequest, response: IVoiceResponse) => {
      try {
        var intent = new ActiveTasksIntentHandler(this.logger, this.deviceRepo, self.config);
        return intent.handleIntent(request, response);
      } catch (e) {
        logger.error(e);
      }
    });
  }
}

export interface IVoiceHandlerFactory {
  getVoiceHandler(logger: ILogger, deviceRepo: IDeviceRepo, app: any, config: ISystemConfig): IVoiceHandler;
}

@injectable()
export class RuntimeVoiceHandlerFactory implements IVoiceHandlerFactory {
  getVoiceHandler(logger: ILogger, deviceRepo: IDeviceRepo, app: any, config: ISystemConfig): IVoiceHandler {
    return new AlexaVoiceHandler(logger, deviceRepo, app, config);
  }
}