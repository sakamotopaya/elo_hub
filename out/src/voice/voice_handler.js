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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
require("reflect-metadata");
const alexa_app_1 = require("alexa-app");
const device_control_intent_1 = require("../intents/device_control_intent");
const types_1 = require("../types");
const alexa_launch_handler_1 = require("../intents/alexa_launch_handler");
const check_build_status_intent_1 = require("../intents/check_build_status_intent");
const queue_build_intent_1 = require("../intents/queue_build_intent");
const active_tasks_intent_1 = require("../intents/active_tasks_intent");
const status_report_intent_1 = require("../intents/status_report_intent");
const feature_disabled_intent_1 = require("../intents/feature_disabled_intent");
const expense_query_intent_1 = require("../intents/expense_query_intent");
;
let AlexaVoiceHandler = class AlexaVoiceHandler {
    constructor(logger, deviceRepo, vstsRepo, expressApp, config) {
        this.alexaApp = new alexa_app_1.app("alexa");
        this.logger = logger;
        this.deviceRepo = deviceRepo;
        this.config = config;
        this.vstsRepo = vstsRepo;
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
                return intent.handleIntent(request, response);
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
                return intent.handleIntent(request, response);
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
                if (self.config.featureSet.vsts) {
                    let intent = new check_build_status_intent_1.CheckBuildStatusIntentHandler(this.logger, this.deviceRepo, this.config);
                    return intent.handleIntent(request, response);
                }
                else {
                    let intent = new feature_disabled_intent_1.FeatureDisabledIntentHandler(this.logger);
                    return intent.handleIntent(request, response);
                }
            }
            catch (e) {
                logger.error(e);
                response.say(e);
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
                if (self.config.featureSet.vsts) {
                    let intent = new queue_build_intent_1.QueueBuildIntentHandler(this.logger, this.deviceRepo, this.config);
                    return intent.handleIntent(request, response);
                }
                else {
                    let intent = new feature_disabled_intent_1.FeatureDisabledIntentHandler(this.logger);
                    return intent.handleIntent(request, response);
                }
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
                let intent = new queue_build_intent_1.QueueBuildIntentHandler(this.logger, this.deviceRepo, this.config);
                return intent.handleIntent(request, response);
            }
            catch (e) {
                logger.error(e);
            }
        });
        this.alexaApp.intent("ActiveTasksIntent", {
            "slots": {},
            "utterances": [
                "to list my active tasks"
            ]
        }, (request, response) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (self.config.featureSet.vsts) {
                    let intent = new active_tasks_intent_1.ActiveTasksIntentHandler(this.logger, this.vstsRepo, self.config);
                    return intent.handleIntent(request, response);
                }
                else {
                    let intent = new feature_disabled_intent_1.FeatureDisabledIntentHandler(this.logger);
                    return intent.handleIntent(request, response);
                }
            }
            catch (e) {
                logger.error(e);
            }
        }));
        this.alexaApp.intent("StatusReportIntent", {
            "slots": {},
            "utterances": [
                "to read the current status report"
            ]
        }, (request, response) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (self.config.featureSet.wiki) {
                    var intent = new status_report_intent_1.StatusReportIntentHandler(this.logger, self.config);
                    return intent.handleIntent(request, response);
                }
                else {
                    let intent = new feature_disabled_intent_1.FeatureDisabledIntentHandler(this.logger);
                    return intent.handleIntent(request, response);
                }
            }
            catch (e) {
                logger.error(e);
            }
        }));
        this.alexaApp.intent("ExpenseQueryIntent", {
            "slots": {},
            "utterances": [
                "how much have I spent on <expense> this <period>"
            ]
        }, (request, response) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (self.config.featureSet.exfin) {
                    var intent = new expense_query_intent_1.ExpenseQueryIntentHandler(this.logger, self.config);
                    return intent.handleIntent(request, response);
                }
                else {
                    let intent = new feature_disabled_intent_1.FeatureDisabledIntentHandler(this.logger);
                    return intent.handleIntent(request, response);
                }
            }
            catch (e) {
                logger.error(e);
            }
        }));
    }
};
AlexaVoiceHandler = __decorate([
    __param(0, inversify_1.inject(types_1.TYPES.Logger)),
    __param(1, inversify_1.inject(types_1.TYPES.DeviceRepo)),
    __param(2, inversify_1.inject(types_1.TYPES.VstsRepo)),
    __param(3, inversify_1.inject(types_1.TYPES.ExpressApp)),
    __param(4, inversify_1.inject(types_1.TYPES.Config)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], AlexaVoiceHandler);
exports.AlexaVoiceHandler = AlexaVoiceHandler;
let RuntimeVoiceHandlerFactory = class RuntimeVoiceHandlerFactory {
    getVoiceHandler(logger, deviceRepo, vstsRepo, app, config) {
        return new AlexaVoiceHandler(logger, deviceRepo, vstsRepo, app, config);
    }
};
RuntimeVoiceHandlerFactory = __decorate([
    inversify_1.injectable()
], RuntimeVoiceHandlerFactory);
exports.RuntimeVoiceHandlerFactory = RuntimeVoiceHandlerFactory;
//# sourceMappingURL=voice_handler.js.map