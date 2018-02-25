import { container } from "./boot";
import * as express from 'express'
import * as bodyParser from 'body-parser';
import axios from 'axios';
import { IDeviceFactory } from './device/device_factory';
import { AlexaVoiceHandler, IVoiceHandlerFactory } from './voice/voice_handler';
import { ILogger } from './logger';
import { IMessageHub } from './message_hub';
import { TYPES } from "./types";
import { ISystemConfig, IExpressApp } from "./utility/utility";
import { IDeviceRepo } from "./device/device_repo";
import { IExpressRequest, IExpressResponse } from "./api_handlers/handler_api";
import { HelloHandler } from "./api_handlers/hello_handler";
import { NgrokConfigHandler } from "./api_handlers/ngrok_config_handler";
import { ExpressDeviceRelayHandler } from "./api_handlers/relay_handler";
import { DeviceListHandler } from "./api_handlers/device_list_handler";
import { UpdateDeviceHandler } from "./api_handlers/update_device_handler";
import { GenericListHandler } from "./api_handlers/generic_list_handler";
import { DeviceProfileListHandler } from "./api_handlers/device_profile_list_handler";
import { AnimationPackListHandler } from "./api_handlers/animation_pack_list_handler";
import { IAnimationRepo } from "./animations/animation_repo";
import { IRegisterMapRepo } from "./registers/register_map_repo";
import { RegisterMap } from "./registers/register_map_models";
import { IVstsRepo } from "./vsts/vsts_repo";
import { RepoScanner, KnowledgeDocParser, IKnowledgeDocConfig } from "./documents/knowledge_doc_parser";
import { IVoiceHandler } from "./voice/voice_interfaces";
import { ElasticRepo, IDocument, IDocumentCriteria } from "./elasicsearch/elastic_repo";

export class App {

  private logger: ILogger;
  private expressApp: any;
  private voiceHandler: IVoiceHandler;
  private deviceRepo: IDeviceRepo;
  private vstsRepo: IVstsRepo;
  private animationRepo: IAnimationRepo;
  private registerMapRepo: IRegisterMapRepo;
  private config: ISystemConfig;
  private messageHub: IMessageHub;

  constructor() {

    this.deviceRepo = container.get<IDeviceRepo>(TYPES.DeviceRepo);
    this.logger = container.get<ILogger>(TYPES.Logger);
    this.messageHub = container.get<IMessageHub>(TYPES.MessageHub);
    this.animationRepo = container.get<IAnimationRepo>(TYPES.AnimationRepo);
    this.registerMapRepo = container.get<IRegisterMapRepo>(TYPES.RegisterMapRepo);
    this.vstsRepo = container.get<IVstsRepo>(TYPES.VstsRepo);
    this.config = container.get<ISystemConfig>(TYPES.Config);

    this.expressApp = express();
    this.expressApp.set("view engine", "ejs");
    this.expressApp.use(bodyParser.json());
    container.bind<IExpressApp>(TYPES.Config).toConstantValue(this.expressApp);

    let voiceHandlerFactory = container.get<IVoiceHandlerFactory>(TYPES.VoiceHandlerFactory);
    this.voiceHandler = voiceHandlerFactory.getVoiceHandler(this.logger, this.deviceRepo, this.vstsRepo, this.expressApp, this.config);

    this.mountRoutes();

  }

  public run(port: number): void {

    let app = this.expressApp;
    let self = this;

    app.get('/api/hello', (req: IExpressRequest, res: IExpressResponse) => {

        let config: IKnowledgeDocConfig = { repoRoot: "/Users/sakamoto/code/karmak/elk_wiki" };
        let scanner = new RepoScanner(config);
        let result = scanner.scan();
        result.then((payload) => {
          res.json(payload);
        });

        //const handler = new HelloHandler();
        //await handler.handle(req, res);

    });

    app.get('/api/config', async (req: IExpressRequest, res: IExpressResponse) => {

      try {
        const handler = new NgrokConfigHandler();
        await handler.handle(req, res);

      } catch (error) {
        console.log(error);
      }

    });

    app.get('/api/devices', async (req: IExpressRequest, res: IExpressResponse) => {

      try {
        const handler = new DeviceListHandler(self.deviceRepo);
        await handler.handle(req, res);

      } catch (error) {
        console.log(error);
      }

    });

    app.get('/api/documents/:category/:documentType/all', async (req: IExpressRequest, res: IExpressResponse) => {

      try {
        const repo = new ElasticRepo(self.config);
        let results = await repo.all({ category: req.params.category, documentType: req.params.documentType});
        res.json(results);

      } catch (error) {
        res.status(500).send(error);
      }

    });

    app.post('/api/documents/:category/:documentType', async (req: IExpressRequest, res: IExpressResponse) => {

      try {
        const repo = new ElasticRepo(self.config);
        let criteria = <IDocumentCriteria> { category: req.params.category, documentType: req.params.documentType, criteria: req.body};
        let results = await repo.search(criteria);
        res.json(results);

      } catch (error) {
        res.status(500).send(error);
      }

    });

    app.put('/api/document/:category/:documentType/:resourceId', async (req: IExpressRequest, res: IExpressResponse) => {

      try {
        const repo = new ElasticRepo(self.config);
        let doc : IDocument = <IDocument> { id: req.params.resourceId, category: req.params.category, documentType: req.params.documentType, documentBody: req.body };
        let results = await repo.create(doc);
        res.json(results);

      } catch (error) {
        res.status(500).send(error);
      }

    });

    app.post('/api/document/:category/:documentType/:resourceId', async (req: IExpressRequest, res: IExpressResponse) => {

      try {
        const repo = new ElasticRepo(self.config);
        let doc : IDocument = <IDocument> { id: req.params.resourceId, category: req.params.category, documentType: req.params.documentType, documentBody: req.body };
        let results = await repo.update(doc);
        res.json(results);

      } catch (error) {
        res.status(500).send(error);
      }

    });

    app.delete('/api/document/:category/:documentType/:resourceId', async (req: IExpressRequest, res: IExpressResponse) => {

      try {
        const repo = new ElasticRepo(self.config);
        let results = await repo.delete(req.params.category, req.params.documentType, req.params.resourceId);
        res.json(results);

      } catch (error) {
        res.status(500).send(error);
      }

    });

    app.get('/api/registermaps', async (req: IExpressRequest, res: IExpressResponse) => {

      try {
        const handler = new GenericListHandler<RegisterMap>('registermaps', self.registerMapRepo);
        await handler.handle(req, res);

      } catch (error) {
        console.log(error);
      }

    });

    app.get('/api/animationpacks', async (req: IExpressRequest, res: IExpressResponse) => {

      try {
        const handler = new AnimationPackListHandler(self.animationRepo);
        await handler.handle(req, res);

      } catch (error) {
        console.log(error);
      }

    });

    app.get('/api/device_profiles', async (req: IExpressRequest, res: IExpressResponse) => {

      try {
        const handler = new DeviceProfileListHandler(self.deviceRepo);
        await handler.handle(req, res);

      } catch (error) {
        console.log(error);
      }

    });

    app.post('/api/device', async (req: IExpressRequest, res: IExpressResponse) => {

      try {

        if (req.body.name === "sidetable") {
          let deviceAddress = "http://192.168.1.70:88/api/";
          let v2Config = req.body.config;
          let v1Config: any = {};
          let newPayload: any = {};

          if (v2Config.s !== undefined) {

            v1Config.state = v2Config.s;

            if (v2Config.s === 1) {
              deviceAddress = deviceAddress + "dev_on";
            } else {
              deviceAddress = deviceAddress + "dev_off";
            }

          } else if (v2Config.l !== undefined) {
            deviceAddress = deviceAddress + "dev_level";
            v1Config.brightness = v2Config.l;
          } else if (v2Config.a !== undefined) {
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
  
          } else if (v2Config.c !== undefined) {
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

          const handler = new ExpressDeviceRelayHandler();
          await handler.handle(req, res);
        } else {
          const handler = new UpdateDeviceHandler(self.deviceRepo, self.messageHub);
          await handler.handle(req, res);
        }

      } catch (error) {
        console.log(error);
      }

    });

    app.post('/api/relay', async (req: IExpressRequest, res: IExpressResponse) => {

      try {
        const handler = new ExpressDeviceRelayHandler();
        await handler.handle(req, res);

      } catch (error) {
        console.log(error);
      }

    });

    app.listen(port, (err) => {
      if (err) {
        return console.log(err);
      }

      return console.log(`elo_hub:b2:${port} is listening...`);
    });

  }

  private mountRoutes(): void {
    const router = express.Router()
    router.get('/', (req, res) => {
      res.json({
        message: 'Hello World'
      })
    })
    this.expressApp.use('/', router)
  }

}
