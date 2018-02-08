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
const fs = require("fs");
const filewatcher = require("filewatcher");
const path = require("path");
const inversify_1 = require("inversify");
const dictionary_1 = require("../utility/dictionary");
const types_1 = require("../types");
class AnimationPack {
}
exports.AnimationPack = AnimationPack;
class Animation {
}
exports.Animation = Animation;
;
;
;
class RepoBase {
    constructor(logger, repoConfig, repoFileName) {
        this.repoConfig = repoConfig;
        this.repoFileName = repoFileName;
        this.initializeRepo();
        this.watchRepo();
    }
    getFullRepoPath() {
        return path.join(this.repoConfig.repoPath, this.repoFileName);
    }
    watchRepo() {
        let that = this;
        let repoPath = this.getFullRepoPath();
        let watcher = filewatcher();
        watcher.add(repoPath);
        watcher.on('change', function (file, stat) {
            console.log(this.repoFileName + ' repo has changed, reloading...');
            that.initializeRepo();
        });
    }
    getItem(key) {
        if (this.items.containsKey(key))
            return this.items.item(key);
        return undefined;
    }
    getKey(item) {
        return undefined;
    }
    readItems(buf) {
        return JSON.parse(buf.toString());
    }
    initializeRepo() {
        let self = this;
        this.items = new dictionary_1.KeyedCollection();
        let repoPath = this.getFullRepoPath();
        let fileStore = self.readItems(fs.readFileSync(repoPath));
        fileStore.forEach(item => {
            let key = self.getKey(item);
            this.items.add(key, item);
        });
    }
}
exports.RepoBase = RepoBase;
;
let AnimationRepo = class AnimationRepo extends RepoBase {
    constructor(logger, systemConfig) {
        super(logger, systemConfig.animationRepo, "animations.json");
    }
    getKey(item) {
        return item.name;
    }
};
AnimationRepo = __decorate([
    __param(0, inversify_1.inject(types_1.TYPES.Logger)),
    __param(1, inversify_1.inject(types_1.TYPES.Config)),
    __metadata("design:paramtypes", [Object, Object])
], AnimationRepo);
exports.AnimationRepo = AnimationRepo;
;
//# sourceMappingURL=animation_repo.js.map