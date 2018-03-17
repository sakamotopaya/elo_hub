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
const generic_list_handler_1 = require("./api_handlers/generic_list_handler");
const device_profile_list_handler_1 = require("./api_handlers/device_profile_list_handler");
const animation_pack_list_handler_1 = require("./api_handlers/animation_pack_list_handler");
const elastic_repo_1 = require("./elasicsearch/elastic_repo");
const raven_repo_1 = require("./ravendb/raven_repo");
class App {
    constructor() {
        this.deviceRepo = boot_1.container.get(types_1.TYPES.DeviceRepo);
        this.logger = boot_1.container.get(types_1.TYPES.Logger);
        this.messageHub = boot_1.container.get(types_1.TYPES.MessageHub);
        this.animationRepo = boot_1.container.get(types_1.TYPES.AnimationRepo);
        this.registerMapRepo = boot_1.container.get(types_1.TYPES.RegisterMapRepo);
        this.vstsRepo = boot_1.container.get(types_1.TYPES.VstsRepo);
        this.config = boot_1.container.get(types_1.TYPES.Config);
        this.expressApp = express();
        this.expressApp.set("view engine", "ejs");
        this.expressApp.use(bodyParser.json());
        boot_1.container.bind(types_1.TYPES.Config).toConstantValue(this.expressApp);
        let voiceHandlerFactory = boot_1.container.get(types_1.TYPES.VoiceHandlerFactory);
        this.voiceHandler = voiceHandlerFactory.getVoiceHandler(this.logger, this.deviceRepo, this.vstsRepo, this.expressApp, this.config);
        this.mountRoutes();
    }
    run(port) {
        let app = this.expressApp;
        let self = this;
        app.get('/api/hello', (req, res) => __awaiter(this, void 0, void 0, function* () {
            /*let config: IKnowledgeDocConfig = { repoRoot: "/Users/sakamoto/code/karmak/elk_wiki" };
            let scanner = new RepoScanner(config);
            let result = scanner.scan();
            result.then((payload) => {
              res.json(payload);
            });*/
            const handler = new hello_handler_1.HelloHandler();
            yield handler.handle(req, res);
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
        app.get('/api/objects/all', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const repo = new raven_repo_1.RavenRepo();
                let results = yield repo.all({ category: req.params.category, documentType: req.params.documentType });
                res.json(results);
            }
            catch (error) {
                res.status(500).send(error);
            }
        }));
        app.get('/api/documents/:category/:documentType/all', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const repo = new elastic_repo_1.ElasticRepo(self.config);
                let results = yield repo.all({ category: req.params.category, documentType: req.params.documentType });
                res.json(results);
            }
            catch (error) {
                res.status(500).send(error);
            }
        }));
        app.post('/api/documents/:category/:documentType', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const repo = new elastic_repo_1.ElasticRepo(self.config);
                let criteria = { category: req.params.category, documentType: req.params.documentType, criteria: req.body };
                let results = yield repo.search(criteria);
                res.json(results);
            }
            catch (error) {
                res.status(500).send(error);
            }
        }));
        app.put('/api/document/:category/:documentType/:resourceId', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const repo = new elastic_repo_1.ElasticRepo(self.config);
                let doc = { id: req.params.resourceId, category: req.params.category, documentType: req.params.documentType, documentBody: req.body };
                let results = yield repo.create(doc);
                res.json(results);
            }
            catch (error) {
                res.status(500).send(error);
            }
        }));
        app.post('/api/document/:category/:documentType/:resourceId', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const repo = new elastic_repo_1.ElasticRepo(self.config);
                let doc = { id: req.params.resourceId, category: req.params.category, documentType: req.params.documentType, documentBody: req.body };
                let results = yield repo.update(doc);
                res.json(results);
            }
            catch (error) {
                res.status(500).send(error);
            }
        }));
        app.delete('/api/document/:category/:documentType/:resourceId', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const repo = new elastic_repo_1.ElasticRepo(self.config);
                let results = yield repo.delete(req.params.category, req.params.documentType, req.params.resourceId);
                res.json(results);
            }
            catch (error) {
                res.status(500).send(error);
            }
        }));
        app.get('/api/registermaps', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const handler = new generic_list_handler_1.GenericListHandler('registermaps', self.registerMapRepo);
                yield handler.handle(req, res);
            }
            catch (error) {
                console.log(error);
            }
        }));
        app.get('/api/animationpacks', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const handler = new animation_pack_list_handler_1.AnimationPackListHandler(self.animationRepo);
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
                    let deviceAddress = "http://192.168.1.70:88/api/";
                    let v2Config = req.body.config;
                    let v1Config = {};
                    let newPayload = {};
                    if (v2Config.s !== undefined) {
                        v1Config.state = v2Config.s;
                        if (v2Config.s === 1) {
                            deviceAddress = deviceAddress + "dev_on";
                        }
                        else {
                            deviceAddress = deviceAddress + "dev_off";
                        }
                    }
                    else if (v2Config.l !== undefined) {
                        deviceAddress = deviceAddress + "dev_level";
                        v1Config.brightness = v2Config.l;
                    }
                    else if (v2Config.a !== undefined) {
                        deviceAddress = deviceAddress + "dev_anim";
                        v1Config.anim = v2Config.a;
                        if (v2Config.p1 !== undefined) {
                            v1Config.p1 = v2Config.p1;
                        }
                        if (v2Config.p2 !== undefined) {
                            v1Config.p2 = v2Config.p2;
                        }
                        if (v2Config.p3 !== undefined) {
                            v1Config.p3 = v2Config.p3;
                        }
                        if (v2Config.p4 !== undefined) {
                            v1Config.p4 = v2Config.p4;
                        }
                        if (v2Config.p5 !== undefined) {
                            v1Config.p5 = v2Config.p5;
                        }
                    }
                    else if (v2Config.c !== undefined) {
                        deviceAddress = deviceAddress + "dev_color";
                        v1Config.red = v2Config.r;
                        v1Config.green = v2Config.g;
                        v1Config.blue = v2Config.b;
                    }
                    // state change can also send brightness
                    if (v2Config.l !== undefined)
                        v1Config.brightness = v2Config.l;
                    newPayload.deviceAddress = encodeURIComponent(deviceAddress);
                    newPayload.payload = v1Config;
                    req.body = newPayload;
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
            return console.log(`elo_hub:b2:${port} is listening...`);
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