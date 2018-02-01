import { container } from "./boot";
import * as express from 'express'
import * as bodyParser from 'body-parser';
import axios from 'axios';
import { IDeviceFactory } from './device/device_factory';
import { IVoiceHandler, AlexaVoiceHandler, IVoiceHandlerFactory } from './voice_handler';
import { ILogger } from './logger';
import { IMessageHub } from './message_hub';
import { TYPES } from "./types";
import { ISystemConfig, IExpressApp } from "./utility/utility";
import { IDeviceRepo } from "./device/device_repo";
import { IExpressRequest, IExpressResponse } from "./api_handlers/handler_api";
import { IVoiceResponse } from "./intents/device_control_intent";
import { HelloHandler } from "./api_handlers/hello_handler";
import { NgrokConfigHandler } from "./api_handlers/ngrok_config_handler";
import { ExpressDeviceRelayHandler } from "./api_handlers/relay_handler";
import { DeviceListHandler } from "./api_handlers/device_list_handler";
import { UpdateDeviceHandler } from "./api_handlers/update_device_handler";
import { DeviceProfileListHandler } from "./api_handlers/device_profile_list_handler";

export class App {

  private logger: ILogger;
  private expressApp: any;
  private voiceHandler: IVoiceHandler;
  private deviceRepo: IDeviceRepo;
  private messageHub: IMessageHub;

  constructor() {

    this.deviceRepo = container.get<IDeviceRepo>(TYPES.DeviceRepo);
    this.logger = container.get<ILogger>(TYPES.Logger);
    this.messageHub = container.get<IMessageHub>(TYPES.MessageHub);

    this.expressApp = express();
    this.expressApp.set("view engine", "ejs");
    this.expressApp.use(bodyParser.json());
    container.bind<IExpressApp>(TYPES.Config).toConstantValue(this.expressApp);

    let voiceHandlerFactory = container.get<IVoiceHandlerFactory>(TYPES.VoiceHandlerFactory);
    this.voiceHandler = voiceHandlerFactory.getVoiceHandler(this.logger, this.deviceRepo, this.expressApp);

    this.mountRoutes();

  }

  public run(port: number): void {

    let app = this.expressApp;
    let self = this;

    app.get('/api/hello', async (req: IExpressRequest, res: IExpressResponse) => {

      try {
        const handler = new HelloHandler();
        await handler.handle(req, res);

      } catch (error) {
        console.log(error);
      }

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
          let deviceAddress = encodeURIComponent("192.168.1.70:88");
          let devicePayload = req.body.payload;
          let newPayload = { deviceAddress: deviceAddress, payload : devicePayload };

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

      return console.log(`server is listening on ${port}`);
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
