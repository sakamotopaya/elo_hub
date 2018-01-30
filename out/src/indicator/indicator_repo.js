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
const boot_1 = require("../boot");
const dictionary_1 = require("../utility/dictionary");
const inversify_1 = require("inversify");
const types_1 = require("../types");
class IndicatorRuleType {
}
IndicatorRuleType.equal = 1;
IndicatorRuleType.range = 2;
exports.IndicatorRuleType = IndicatorRuleType;
class Indicator {
    constructor() {
        this.rules = [];
    }
}
exports.Indicator = Indicator;
;
class IndicatorContext {
}
;
class IndicatorRule {
}
;
;
let IndicatorRepo = class IndicatorRepo {
    constructor(logger, systemConfig) {
        this.indicators = new dictionary_1.KeyedCollection();
        this.initializeRepo(this.indicators);
    }
    initializeRepo(indicators) {
        let context = { indicator: { name: 'elo_ind_df', rules: [] } };
        this.addDogFoodIndicatorRules(context.indicator);
        indicators.add('elo_ind_df', context);
        context = { indicator: { name: 'elo_ind_bld', rules: [] } };
        this.addBuildIndicatorRules(context.indicator);
        indicators.add('elo_ind_bld', context);
    }
    addDogFoodIndicatorRules(indicator) {
        indicator.rules.push(this.createRule(IndicatorRuleType.range, 'elo_dfmon', 'v1', 'elo_wb', 1, 2, 2, undefined, 624));
        indicator.rules.push(this.createRule(IndicatorRuleType.range, 'elo_dfmon', 'v1', 'elo_wb', 1, 2, 4, 625, 899));
        indicator.rules.push(this.createRule(IndicatorRuleType.range, 'elo_dfmon', 'v1', 'elo_wb', 1, 2, 0, 900, undefined));
    }
    addBuildIndicatorRules(indicator) {
        indicator.rules.push(this.createRule(IndicatorRuleType.equal, 'elo_bld', 'v1', 'elo_wb', 0, 2, 2, 0, undefined));
        indicator.rules.push(this.createRule(IndicatorRuleType.equal, 'elo_bld', 'v1', 'elo_wb', 0, 2, 1, 1, undefined));
        indicator.rules.push(this.createRule(IndicatorRuleType.equal, 'elo_bld', 'v1', 'elo_wb', 0, 2, 3, 2, undefined));
    }
    createRule(ruleType, triggerName, triggerVar, deviceName, deviceIndicator, indicatorState, indicatorLevel, minVal, maxVal) {
        let rule = new IndicatorRule();
        rule.ruleType = ruleType;
        rule.triggerName = triggerName;
        rule.triggerVar = triggerVar;
        rule.deviceName = deviceName;
        rule.deviceIndicator = deviceIndicator;
        rule.indicatorState = indicatorState;
        rule.indicatorLevel = indicatorLevel;
        rule.minVal = minVal;
        rule.maxVal = maxVal;
        return rule;
    }
    getIndicatorsInterestedInDeviceStateChange(deviceName) {
        let indicators = new dictionary_1.KeyedCollection();
        let allContexts = this.indicators.values();
        allContexts.forEach(context => {
            let rules = context.indicator.rules;
            rules.forEach(rule => {
                if (rule.triggerName === deviceName) {
                    if (!indicators.containsKey(context.indicator.name))
                        indicators.add(context.indicator.name, context.indicator);
                }
            });
        });
        return indicators.values();
    }
    getIndicator(name) {
        if (this.indicators.containsKey(name)) {
            return this.indicators.item(name).indicator;
        }
        return undefined;
    }
};
IndicatorRepo = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.Logger)),
    __param(1, inversify_1.inject(types_1.TYPES.Config)),
    __metadata("design:paramtypes", [Object, Object])
], IndicatorRepo);
exports.IndicatorRepo = IndicatorRepo;
;
class IndicatorStatus {
}
exports.IndicatorStatus = IndicatorStatus;
;
class MqttIndicatorAction {
    constructor(deviceName, indicatorId, indicatorState, indicatorLevel) {
        this.deviceName = deviceName;
        this.indicatorId = indicatorId;
        this.indicatorState = indicatorState;
        this.indicatorLevel = indicatorLevel;
    }
    invoke() {
        let status = { i: this.indicatorId, is: this.indicatorState, il: this.indicatorLevel };
        let messageHub = boot_1.container.get(types_1.TYPES.MessageHub);
        messageHub.broadcastIndicatorStatus(this.deviceName, status);
    }
}
exports.MqttIndicatorAction = MqttIndicatorAction;
;
;
let IndicatorRulesEngine = class IndicatorRulesEngine {
    constructor(indicatorRepo, deviceRepo) {
        this.indicatorRepo = indicatorRepo;
        this.deviceRepo = deviceRepo;
    }
    processDeviceStateChange(deviceName) {
        let self = this;
        let indicatorActions = [];
        let affectedIndicators = this.indicatorRepo.getIndicatorsInterestedInDeviceStateChange(deviceName);
        affectedIndicators.forEach(indicator => {
            indicatorActions = indicatorActions.concat(self.processIndicatorRules(indicator));
        });
        return indicatorActions;
    }
    processIndicatorRules(indicator) {
        let self = this;
        let indicatorActions = [];
        let deviceState = new dictionary_1.KeyedCollection();
        indicator.rules.forEach(rule => {
            let triggerState = self.getDeviceState(rule.triggerName, deviceState);
            let triggerVal = triggerState[rule.triggerVar];
            if (triggerVal !== undefined) {
                if (rule.ruleType === IndicatorRuleType.equal) {
                    if (triggerVal === rule.minVal)
                        indicatorActions.push(self.createIndicatorAction(rule.deviceName, rule.deviceIndicator, rule.indicatorState, rule.indicatorLevel));
                }
                else if (rule.ruleType === IndicatorRuleType.range) {
                    if (rule.minVal === undefined && triggerVal <= rule.maxVal)
                        indicatorActions.push(self.createIndicatorAction(rule.deviceName, rule.deviceIndicator, rule.indicatorState, rule.indicatorLevel));
                    else if (rule.minVal !== undefined && triggerVal >= rule.minVal && rule.maxVal !== undefined && triggerVal <= rule.maxVal)
                        indicatorActions.push(self.createIndicatorAction(rule.deviceName, rule.deviceIndicator, rule.indicatorState, rule.indicatorLevel));
                    else if (rule.maxVal === undefined && triggerVal >= rule.minVal)
                        indicatorActions.push(self.createIndicatorAction(rule.deviceName, rule.deviceIndicator, rule.indicatorState, rule.indicatorLevel));
                }
            }
        });
        return indicatorActions;
    }
    createIndicatorAction(deviceName, indicatorId, indicatorState, indicatorLevel) {
        let action = new MqttIndicatorAction(deviceName, indicatorId, indicatorState, indicatorLevel);
        return action;
    }
    getDeviceState(deviceName, stateIndex) {
        if (stateIndex.containsKey(deviceName))
            return stateIndex.item(deviceName);
        else {
            let deviceState = this.deviceRepo.getDeviceState(deviceName);
            stateIndex.add(deviceName, deviceState);
            return deviceState;
        }
    }
};
IndicatorRulesEngine = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.IndicatorRepo)),
    __param(1, inversify_1.inject(types_1.TYPES.DeviceRepo)),
    __metadata("design:paramtypes", [Object, Object])
], IndicatorRulesEngine);
exports.IndicatorRulesEngine = IndicatorRulesEngine;
//# sourceMappingURL=indicator_repo.js.map