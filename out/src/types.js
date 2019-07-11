"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TYPES = {
    DeviceFactory: Symbol("IDeviceFactory"),
    VoiceHandlerFactory: Symbol("IVoiceHandlerFactory"),
    MessageHub: Symbol("IMessageHub"),
    Logger: Symbol("ILogger"),
    Config: Symbol("ISystemConfig"),
    ExpressApp: Symbol("IExpressApp"),
    DeviceRepo: Symbol("IDeviceRepo"),
    TopicHandlerFactory: Symbol("ITopicHandlerFactory"),
    IndicatorRepo: Symbol("IIndicatorRepo"),
    IndicatorRulesEngine: Symbol("IIndicatorRulesEngine"),
    AnimationRepo: Symbol("IAnimationRepo"),
    RegisterMapRepo: Symbol("IRegisterMapRepo"),
    VstsRepo: Symbol("IVstsRepo")
};
exports.TYPES = TYPES;
const JenkinsFileNames = {
    BuildResults: "jenkins_build_status.json",
    CheckBuildStatus: "jenkins_check_build_status.sh",
};
exports.JenkinsFileNames = JenkinsFileNames;
const VstsFileNames = {
    BuildResults: "build_status.json",
    CheckBuildStatus: "check_build_status.sh",
    QueueBuild: "queue_build.sh",
    ListActiveTasks: "list_active_tasks.sh",
    ActiveTaskResults: "active_tasks.json"
};
exports.VstsFileNames = VstsFileNames;
const StandardVoiceResponses = {
    MissingScript: "I seem to have lost the script. You can probably get sakamoto to fix it.",
    MissingBuildResults: "The file containing the last build result is not where it should be."
};
exports.StandardVoiceResponses = StandardVoiceResponses;
const ELO_HUB_VERSION = "0.0.3.0";
exports.ELO_HUB_VERSION = ELO_HUB_VERSION;
//# sourceMappingURL=types.js.map