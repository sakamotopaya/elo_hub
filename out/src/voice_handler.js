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
const inversify_1 = require("inversify");
require("reflect-metadata");
const alexa_app_1 = require("alexa-app");
const device_control_intent_1 = require("./intents/device_control_intent");
const types_1 = require("./types");
const alexa_launch_handler_1 = require("./intents/alexa_launch_handler");
const build_intent_1 = require("./intents/build_intent");
const queue_build_intent_1 = require("./intents/queue_build_intent");
let AlexaVoiceHandler = class AlexaVoiceHandler {
    constructor(logger, deviceRepo, expressApp) {
        this.alexaApp = new alexa_app_1.app("alexa");
        this.logger = logger;
        this.deviceRepo = deviceRepo;
        this.alexaApp.express({
            expressApp: expressApp,
            checkCert: false,
            debug: true
        });
        this.initialize();
    }
    initialize() {
        var self = this;
        var logger = this.logger;
        this.alexaApp.launch((request, response) => {
            try {
                var intent = new alexa_launch_handler_1.AlexaLaunchHandler(this.logger, this.deviceRepo);
                intent.handleIntent(request, response);
            }
            catch (e) {
                logger.error(e);
            }
        });
        this.alexaApp.intent("DeviceControlIntent", {
            "slots": {},
            "utterances": [
                "to turn on|off the device"
            ]
        }, (request, response) => {
            try {
                var intent = new device_control_intent_1.DeviceControlIntentHandler(this.logger, this.deviceRepo);
                intent.handleIntent(request, response);
            }
            catch (e) {
                logger.error(e);
            }
        });
        this.alexaApp.intent("BuildIntent", {
            "slots": {},
            "utterances": [
                "to check on the build",
                "to get the status of the build",
                "to get the build status"
            ]
        }, (request, response) => {
            try {
                var intent = new build_intent_1.BuildIntentHandler(this.logger, this.deviceRepo);
                intent.handleIntent(request, response);
            }
            catch (e) {
                logger.error(e);
            }
        });
        this.alexaApp.intent("QueueBuildIntent", {
            "slots": {},
            "utterances": [
                "to queue a build",
                "to run a build",
                "start a build"
            ]
        }, (request, response) => {
            try {
                var intent = new queue_build_intent_1.QueueBuildIntentHandler(this.logger, this.deviceRepo);
                intent.handleIntent(request, response);
            }
            catch (e) {
                logger.error(e);
            }
        });
        this.alexaApp.intent("AnimationIntent", {
            "slots": {},
            "utterances": [
                "to change the device animation"
            ]
        }, (request, response) => {
            try {
                var intent = new queue_build_intent_1.QueueBuildIntentHandler(this.logger, this.deviceRepo);
                intent.handleIntent(request, response);
            }
            catch (e) {
                logger.error(e);
            }
        });
    }
};
AlexaVoiceHandler = __decorate([
    __param(0, inversify_1.inject(types_1.TYPES.Logger)),
    __param(1, inversify_1.inject(types_1.TYPES.DeviceRepo)),
    __param(2, inversify_1.inject(types_1.TYPES.ExpressApp)),
    __metadata("design:paramtypes", [Object, Object, Object])
], AlexaVoiceHandler);
exports.AlexaVoiceHandler = AlexaVoiceHandler;
let RuntimeVoiceHandlerFactory = class RuntimeVoiceHandlerFactory {
    getVoiceHandler(logger, deviceRepo, app) {
        return new AlexaVoiceHandler(logger, deviceRepo, app);
    }
};
RuntimeVoiceHandlerFactory = __decorate([
    inversify_1.injectable()
], RuntimeVoiceHandlerFactory);
exports.RuntimeVoiceHandlerFactory = RuntimeVoiceHandlerFactory;
//# sourceMappingURL=voice_handler.js.map