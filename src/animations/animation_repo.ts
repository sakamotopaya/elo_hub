import * as fs from 'fs';
import * as filewatcher from 'filewatcher';
import * as path from 'path';
import { inject } from "inversify";
import { ILogger } from "../logger";
import { KeyedCollection } from '../utility/dictionary';
import { ISystemConfig, IRepoConfig } from '../utility/utility';
import { TYPES } from '../types';


export class AnimationPack {
    name: string;
    animations: Animation[]
}

export class Animation {
    id: number;
    title: string;
    p1: number;
    p2: number;
    p3: number;
    p4: number;
    p5: number;

    hasP1: boolean;
    p1Min: number;
    p1Max: number;

    allowColor: boolean;
    allowBrightness: boolean;
};

export interface IRepoBase<T> {
    getItem(key: string): T;
};

export interface IAnimationRepo extends IRepoBase<AnimationPack> {

};

export class RepoBase<T> implements IRepoBase<T> {

    private repoConfig: IRepoConfig;
    private items: KeyedCollection<T>;
    private repoFileName: string;

    constructor(logger: ILogger, repoConfig: IRepoConfig, repoFileName: string) {

        this.repoConfig = repoConfig;
        this.repoFileName = repoFileName;
        this.initializeRepo();
        this.watchRepo();
    }

    private getFullRepoPath(): string {
        return path.join(this.repoConfig.repoPath, this.repoFileName);
    }

    private watchRepo() {
        let that = this;
        let repoPath = this.getFullRepoPath();
        let watcher = filewatcher();

        watcher.add(repoPath);

        watcher.on('change', function (file, stat) {
            console.log(this.repoFileName + ' repo has changed, reloading...');
            that.initializeRepo();
        });
    }

    getItem(key: string): T {
        if (this.items.containsKey(key))
            return this.items.item(key);

        return undefined;
    }

    getKey(item: T): string {
        return undefined;
    }

    readItems(buf: Buffer): T[] {
        return <T[]>JSON.parse(buf.toString());
    }

    initializeRepo() {
        let self = this;
        this.items = new KeyedCollection<T>();

        let repoPath = this.getFullRepoPath();
        let fileStore = self.readItems(fs.readFileSync(repoPath))

        fileStore.forEach(item => {
            let key = self.getKey(item);
            this.items.add(key, <T>item);
        });

    }
};

export class AnimationRepo extends RepoBase<AnimationPack> implements IAnimationRepo {

    constructor( @inject(TYPES.Logger) logger: ILogger,
        @inject(TYPES.Config) systemConfig: ISystemConfig) {

        super(logger, systemConfig.animationRepo, "animations.json");

    }

    getKey(item: AnimationPack): string {
        return item.name;
    }

};
