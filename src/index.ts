import { container } from './boot';
import { App } from './app'
import { IDeviceFactory } from './device/device_factory';
import { IVoiceHandlerFactory } from './voice_handler';
import { ILogger } from './logger';
import { IMessageHub } from './message_hub';
import { TYPES } from './types';
import { ISystemConfig } from './utility/utility';

const port: number = parseInt(process.env.PORT) || 3000;

var config: ISystemConfig = {
  messaging: {
    hubUrl: 'mqtt://pi3_hub',
    listenerDisabled: true,
    listenerPattern: 'elo/#'
  }
};

container.bind<ISystemConfig>(TYPES.Config).toConstantValue(config);

const app = new App();
app.run(port);
