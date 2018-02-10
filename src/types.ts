const TYPES = {
    DeviceFactory: Symbol("IDeviceFactory"),
    VoiceHandlerFactory: Symbol("IVoiceHandlerFactory"),
    MessageHub: Symbol("IMessageHub"),
    Logger: Symbol("ILogger"),
    Config: Symbol("ISystemConfig"),
    ExpressApp: Symbol("IExpressApp"),
    DeviceRepo: Symbol("IDeviceRepo"),
    TopicHandlerFactory : Symbol("ITopicHandlerFactory"),
    IndicatorRepo : Symbol("IIndicatorRepo"),
    IndicatorRulesEngine : Symbol("IIndicatorRulesEngine"),
    AnimationRepo : Symbol("IAnimationRepo"),
    RegisterMapRepo : Symbol("IRegisterMapRepo")
};

export { TYPES };
