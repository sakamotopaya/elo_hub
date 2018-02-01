"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const boot_1 = require("./boot");
const express = require("express");
const bodyParser = require("body-parser");
const types_1 = require("./types");
const hello_handler_1 = require("./api_handlers/hello_handler");
const ngrok_config_handler_1 = require("./api_handlers/ngrok_config_handler");
const relay_handler_1 = require("./api_handlers/relay_handler");
const device_list_handler_1 = require("./api_handlers/device_list_handler");
const update_device_handler_1 = require("./api_handlers/update_device_handler");
const device_profile_list_handler_1 = require("./api_handlers/device_profile_list_handler");
class App {
    constructor() {
        this.deviceRepo = boot_1.container.get(types_1.TYPES.DeviceRepo);
        this.logger = boot_1.container.get(types_1.TYPES.Logger);
        this.messageHub = boot_1.container.get(types_1.TYPES.MessageHub);
        this.expressApp = express();
        this.expressApp.set("view engine", "ejs");
        this.expressApp.use(bodyParser.json());
        boot_1.container.bind(types_1.TYPES.Config).toConstantValue(this.expressApp);
        let voiceHandlerFactory = boot_1.container.get(types_1.TYPES.VoiceHandlerFactory);
        this.voiceHandler = voiceHandlerFactory.getVoiceHandler(this.logger, this.deviceRepo, this.expressApp);
        this.mountRoutes();
    }
    run(port) {
        let app = this.expressApp;
        let self = this;
        app.get('/api/hello', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const handler = new hello_handler_1.HelloHandler();
                yield handler.handle(req, res);
            }
            catch (error) {
                console.log(error);
            }
        }));
        app.get('/api/config', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const handler = new ngrok_config_handler_1.NgrokConfigHandler();
                yield handler.handle(req, res);
            }
            catch (error) {
                console.log(error);
            }
        }));
        app.get('/api/devices', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const handler = new device_list_handler_1.DeviceListHandler(self.deviceRepo);
                yield handler.handle(req, res);
            }
            catch (error) {
                console.log(error);
            }
        }));
        app.get('/api/device_profiles', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const handler = new device_profile_list_handler_1.DeviceProfileListHandler(self.deviceRepo);
                yield handler.handle(req, res);
            }
            catch (error) {
                console.log(error);
            }
        }));
        app.post('/api/device', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.body.name === "sidetable") {
                    let deviceAddress = encodeURIComponent("192.168.1.70:88");
                    let devicePayload = req.body.payload;
                    let newPayload = { deviceAddress: deviceAddress, payload: devicePayload };
                    const handler = new relay_handler_1.ExpressDeviceRelayHandler();
                    yield handler.handle(req, res);
                }
                else {
                    const handler = new update_device_handler_1.UpdateDeviceHandler(self.deviceRepo, self.messageHub);
                    yield handler.handle(req, res);
                }
            }
            catch (error) {
                console.log(error);
            }
        }));
        app.post('/api/relay', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const handler = new relay_handler_1.ExpressDeviceRelayHandler();
                yield handler.handle(req, res);
            }
            catch (error) {
                console.log(error);
            }
        }));
        app.listen(port, (err) => {
            if (err) {
                return console.log(err);
            }
            return console.log(`server is listening on ${port}`);
        });
    }
    mountRoutes() {
        const router = express.Router();
        router.get('/', (req, res) => {
            res.json({
                message: 'Hello World'
            });
        });
        this.expressApp.use('/', router);
    }
}
exports.App = App;
//# sourceMappingURL=app.js.map