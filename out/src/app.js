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