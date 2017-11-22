import { container } from "./boot";
import * as express from 'express'
import * as bodyParser from 'body-parser';
import axios from 'axios';
import { IDeviceFactory } from './device/device_factory';
import { IVoiceHandler, AlexaVoiceHandler, IVoiceHandlerFactory } from './voice_interface';
import { ILogger } from './logger';
import { IMessageHub } from './message_hub';
import { TYPES } from "./types";
import { ISystemConfig, IExpressApp } from "./utility/utility";
import { IDeviceRepo } from "./device/device_repo";

export class App {
  
  private logger: ILogger;
  private expressApp: any;
  private voiceHandler: IVoiceHandler;
  private deviceRepo: IDeviceRepo;
  private messageHub: IMessageHub;

  constructor () {

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

  public run(port: number) : void {

    let app = this.expressApp;

    app.get('/api/hello', function (req, res) {
      res.send('howdy sakamoto');
    });
    
    app.get('/api/config', function (req, res) {
      axios.get('http://localhost:4040/api/tunnels')
        .then(function (response) {
          res.json(response.data);
        })
        .catch(function (error) {
          res.send("Sum ting wong!");
        });
    });
    
    app.post('/api/relay', function (req, res) {
    
      console.log('relay: ' + JSON.stringify(req.body));
    
      let relayPayload = req.body;
      let deviceAddress = decodeURIComponent(relayPayload.deviceAddress);
      let devicePayload = relayPayload.payload;
    
      console.log('relay to : ' + deviceAddress);
      axios.post(deviceAddress, relayPayload.payload)
        .then(function (response) {
          console.log('back from device', JSON.stringify(response.data));
          res.json(response.data);
        })
        .catch(function (error) {
          console.log('error calling device' + JSON.stringify(error));
          res.json({ errorInfo: error });
        });
    });

    app.listen(port, (err) => {
      if (err) {
        return console.log(err);
      }
    
      return console.log(`server is listening on ${port}`);
    });

  }

  private mountRoutes (): void {
    const router = express.Router()
    router.get('/', (req, res) => {
      res.json({
        message: 'Hello World'
      })
    })
    this.expressApp.use('/', router)
  }

}
