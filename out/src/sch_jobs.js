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
const types_1 = require("./types");
const vsts_script_runner_1 = require("./vsts/vsts_script_runner");
;
class RefreshActiveTasksJob {
    run(container, config) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            console.log('refreshing active tasks...');
            try {
                let scriptRunner = new vsts_script_runner_1.VstsScriptRunner(config, types_1.VstsFileNames.ListActiveTasks, types_1.VstsFileNames.ActiveTaskResults, vsts_script_runner_1.VstsActiveTaskCommandBuilder);
                let result = yield scriptRunner.runWithResult();
                let vstsRepo = container.get(types_1.TYPES.VstsRepo);
                vstsRepo.mergeTaskState(result);
                resolve();
            }
            catch (Err) {
                reject(Err);
            }
        }));
    }
}
exports.RefreshActiveTasksJob = RefreshActiveTasksJob;
//# sourceMappingURL=sch_jobs.js.map