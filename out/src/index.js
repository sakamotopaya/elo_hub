"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const boot_1 = require("./boot");
const app_1 = require("./app");
const types_1 = require("./types");
const port = parseInt(process.env.PORT) || 3000;
var config = {
    messaging: {
        hubUrl: 'mqtt://pi3_hub',
        listenerDisabled: true,
        listenerPattern: 'elo/#'
    }
};
boot_1.container.bind(types_1.TYPES.Config).toConstantValue(config);
const app = new app_1.App();
app.run(port);
//# sourceMappingURL=index.js.map