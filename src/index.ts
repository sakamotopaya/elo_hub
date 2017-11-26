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
    hubUrl: 'mqtt://192.168.1.168'
  }
};

container.bind<ISystemConfig>(TYPES.Config).toConstantValue(config);

// const logger = container.get<ILogger>(TYPES.Logger);
// const deviceFactory = container.get<IDeviceFactory>(TYPES.DeviceFactory);
// const voiceHandlerFactory = container.get<IVoiceHandlerFactory>(TYPES.VoiceHandler);
// const messageHub = container.get<IMessageHub>(TYPES.MessageHub);

const app = new App();
app.run(port);
