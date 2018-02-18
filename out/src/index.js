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
const app_1 = require("./app");
const types_1 = require("./types");
const fs = require("fs");
const path = require("path");
const process = require("process");
const sch_jobs_1 = require("./sch_jobs");
const port = parseInt(process.env.PORT) || 3000;
let configPath = process.cwd();
const config = JSON.parse(fs.readFileSync(path.join(configPath, 'elo_hub_cfg.json')).toString());
boot_1.container.bind(types_1.TYPES.Config).toConstantValue(config);
setInterval(() => __awaiter(this, void 0, void 0, function* () {
    let buildStatusJob = new sch_jobs_1.CheckBuildStatusJob();
    yield buildStatusJob.run(boot_1.container, config);
    let vstsTasksJob = new sch_jobs_1.RefreshActiveTasksJob();
    yield vstsTasksJob.run(boot_1.container, config);
}), 30 * 1000);
const app = new app_1.App();
app.run(port);
//# sourceMappingURL=index.js.map