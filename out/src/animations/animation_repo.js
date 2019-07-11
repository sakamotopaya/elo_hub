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
//import * as fs from 'fs';
//import * as filewatcher from 'filewatcher';
//import * as path from 'path';
const inversify_1 = require("inversify");
const types_1 = require("../types");
const repo_base_1 = require("../core/repo_base");
;
let AnimationRepo = class AnimationRepo extends repo_base_1.RepoBase {
    constructor(logger, systemConfig) {
        super(logger, systemConfig.animationRepo);
    }
    getRepoFilename() {
        return "animations.json";
    }
    getKey(item) {
        return item.name;
    }
};
AnimationRepo = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.Logger)),
    __param(1, inversify_1.inject(types_1.TYPES.Config)),
    __metadata("design:paramtypes", [Object, Object])
], AnimationRepo);
exports.AnimationRepo = AnimationRepo;
;
//# sourceMappingURL=animation_repo.js.map