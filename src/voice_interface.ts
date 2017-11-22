import { injectable, inject } from "inversify";
import "reflect-metadata";

import * as express from 'express';
import * as fs from 'fs';
import { exec } from 'child_process'

import { app } from 'alexa-app';
import { ILogger } from './logger';
import { Messages, Utility } from './utility/utility';
import { IDeviceFactory } from './device/device_factory';
import { DeviceControlIntentHandler } from './intents/device_control_intent';
import { TYPES } from "./types";
import { IDeviceRepo } from "./device/device_repo";

//var alexa = require("alexa-app");

export interface IVoiceHandler {

}

export class AlexaVoiceHandler implements IVoiceHandler {

  private alexaApp: app;
  private logger: ILogger;
  private deviceRepo: IDeviceRepo;

  constructor(@inject(TYPES.Logger) logger: ILogger, 
              @inject(TYPES.DeviceRepo) deviceRepo: IDeviceRepo, 
              @inject(TYPES.ExpressApp) expressApp: any) {

    this.alexaApp = new app("alexa");
    this.logger = logger;
    this.deviceRepo = deviceRepo;

    this.alexaApp.express({
      expressApp: expressApp,
      checkCert: false,
      debug: true
    });

    this.initialize();
  }

  private initialize(): void {

    var self = this;

    this.alexaApp.launch(function (request, response) {
      response.say("ELO Hub Start");
    });

    var deviceControlIntent = new DeviceControlIntentHandler(this.logger, this.deviceRepo);
    this.alexaApp.intent("DeviceControlIntent", {
      "slots": {},
      "utterances": [
        "to turn on|off the device"
      ]
    }, deviceControlIntent.handleIntent);

    /*  function (request, response) {

        var deviceName = request.slot("device_name");
        var deviceState = request.slot("device_state");

        self.logger.log(deviceName);

        var address = "";
        var port = "";
        var state = "on";


        if (Utility.isWhiteboard(deviceName)) {
          address = "124";
          port = "8088";
        } else if (Utility.isKitchen(deviceName)) {
          address = "114";
          port = "8088";
        } else if (Utility.isSideTable(deviceName)) {
          address = "70";
          port = "88";
        }

        if (address === "") {
          response.say("I don't recognize " + deviceName + " as a valid device.");
          return;
        }

        if (deviceState === "off")
          state = "off";

        var url = 'http://192.168.1.' + address;
        var device = self.deviceFactory.getDevice(url, parseInt(port));

        device.setOn();
      }
    );*/

    this.alexaApp.intent("BuildIntent", {
      "slots": {},
      "utterances": [
        "to check on the build"
        , "to get the status of the build"
        , "to get the build status"
      ]
    },
      function (request, response) {

        var buildStatus = JSON.parse(fs.readFileSync('build_status.json', 'utf8'))[0];
        var msg = "The build be doing some funky stuff!";

        if (buildStatus.status !== "completed")
          msg = "a build is currently running";
        if (buildStatus.result === "succeeded") {
          msg = "The last build succeeded";
        } else if (buildStatus.result === "failed") {
          msg = "The last build failed";
        }

        response.say(msg);
      }
    );

    this.alexaApp.intent("QueueBuildIntent", {
      "slots": {},
      "utterances": [
        "to queue a build"
        , "to run a build"
        , "start a build"
      ]
    },
      function (request, response) {

        console.log('queuing a build...');
        exec('/home/openhabian/code/elo_alexa/queue_build.sh',
          (error, stdout, stderr) => {
            console.log(stdout);
            console.log(stderr);
            console.log(JSON.stringify(error));
            console.log('build queued...');
            response.say("Ok! A build has been queued");
          });
      }
    );

    this.alexaApp.intent("AnimationIntent", {
      "slots": {},
      "utterances": [
        "to change the device animation"
      ]
    },
      function (request, response) {
        response.say("The most recent build failed. The build error message is: way to friggin go!");
      }
    );

  }
}

export interface IVoiceHandlerFactory {
  getVoiceHandler(logger: ILogger, deviceRepo: IDeviceRepo, app: any): IVoiceHandler;
}

@injectable()
export class RuntimeVoiceHandlerFactory implements IVoiceHandlerFactory {
  getVoiceHandler(logger: ILogger, deviceRepo: IDeviceRepo, app: any): IVoiceHandler {
    return new AlexaVoiceHandler(logger, deviceRepo, app);
  }
}