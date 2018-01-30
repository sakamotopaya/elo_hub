import { container } from './boot';
import { App } from './app'
import { IDeviceFactory } from './device/device_factory';
import { IVoiceHandlerFactory } from './voice_handler';
import { ILogger } from './logger';
import { IMessageHub } from './message_hub';
import { TYPES } from './types';
import { ISystemConfig } from './utility/utility';
import { exec } from 'child_process';
import * as fs from 'fs';
import { IDeviceRepo } from './device/device_repo';
import { IIndicatorRulesEngine } from './indicator/indicator_repo';
import { DeviceStateHandler } from './topics/topic_handler_factory';

const port: number = parseInt(process.env.PORT) || 3000;

var config: ISystemConfig = {
  messaging: {
    hubUrl: 'mqtt://pi3_hub',
    listenerDisabled: false,
    listenerPattern: 'elo/#'
  },
  build: {
    scriptPath: '/home/pi/.elo_hub'
  }
};

container.bind<ISystemConfig>(TYPES.Config).toConstantValue(config);

setInterval(() => {

  console.log('checking build status...');
  exec(config.build.scriptPath + '/check_build_status.sh',
    (error, stdout, stderr) => {
      console.log(stdout);
      console.log(stderr);
      console.log(JSON.stringify(error));

      if (!error || error === null) {
        console.log('reading build status');

        var buildStatus = JSON.parse(fs.readFileSync(config.build.scriptPath + '/build_status.json', 'utf8'))[0];
        var state = 0;

        if (buildStatus.status === "inProgress")
          state = 2;
        else if (buildStatus.status === "completed" && buildStatus.result === "succeeded")
          state = 1;
        
        let deviceRepo : IDeviceRepo = container.get<IDeviceRepo>(TYPES.DeviceRepo);
        let rulesEngine : IIndicatorRulesEngine = container.get<IIndicatorRulesEngine>(TYPES.IndicatorRulesEngine);
        let stateHandler = new DeviceStateHandler('elo_bld', deviceRepo, rulesEngine);
        
        stateHandler.handleMessage("elo/elo_bld/state", JSON.stringify({v1: state}));
      }
    });
}, 30 * 1000);

const app = new App();
app.run(port);
