"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const types_1 = require("../types");
const repo_base_1 = require("../core/repo_base");
const vsts_1 = require("./vsts");
class VstsTask {
}
exports.VstsTask = VstsTask;
;
class VstsState {
}
exports.VstsState = VstsState;
;
;
let VstsRepo = class VstsRepo extends repo_base_1.RepoBase {
    constructor(logger, systemConfig) {
        super(logger, systemConfig.registerMapRepo);
    }
    getRepoFilename() {
        return "vsts_repo.json";
    }
    getKey(item) {
        return item.name;
    }
    getActiveTasks() {
        let allTasks = this.getAllTasks();
        let activeTasks = [];
        allTasks.forEach((task) => {
            activeTasks.push(task);
        });
        return activeTasks;
    }
    getAllTasks() {
        let myState = this.getItem(vsts_1.VstsUtilities.getMyVstsId());
        let allTasks = myState.openTasks;
        let copyOfAllTasks = [];
        allTasks.forEach((task) => { copyOfAllTasks.push(task); });
        return copyOfAllTasks;
    }
    addOrUpdateTask(newTask) {
        let myState = this.getItem(vsts_1.VstsUtilities.getMyVstsId());
        let allTasks = myState.openTasks;
        let index = allTasks.findIndex((task) => { return task.id == newTask.id; });
        if (index == -1)
            allTasks.push(newTask);
        else
            allTasks[index] = newTask;
    }
    mergeTaskState(workItems) {
        let self = this;
        let mergeChangedRepo = false;
        let allTasks = self.getAllTasks();
        workItems.forEach((workItem) => {
            let internalTask = self.findTask(allTasks, workItem.id);
            if (internalTask == null) {
                let task = self.createTaskFromWorkItem(workItem);
                self.addOrUpdateTask(task);
                mergeChangedRepo = true;
            }
            else if (self.mergeTaskAndReturnChanged(workItem, internalTask))
                mergeChangedRepo = true;
        });
        // Still need to see if any tasks have changed
        if (mergeChangedRepo)
            self.save();
    }
    createTaskFromWorkItem(workItem) {
        let task = new VstsTask();
        task.id = workItem.id;
        task.title = vsts_1.VstsUtilities.getTitle(workItem);
        task.originalEstimate = vsts_1.VstsUtilities.getOriginalEstimate(workItem);
        task.completedWork = vsts_1.VstsUtilities.getCompletedWork(workItem);
        task.remainingWork = vsts_1.VstsUtilities.getRemainingWork(workItem);
        return task;
    }
    findTask(tasks, id) {
        tasks.forEach((task) => {
            if (task.id == id)
                return task;
        });
        return null;
    }
    mergeTaskAndReturnChanged(workItem, task) {
        return false;
    }
};
VstsRepo = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.Logger)),
    __param(1, inversify_1.inject(types_1.TYPES.Config)),
    __metadata("design:paramtypes", [Object, Object])
], VstsRepo);
exports.VstsRepo = VstsRepo;
;
//# sourceMappingURL=vsts_repo.js.map