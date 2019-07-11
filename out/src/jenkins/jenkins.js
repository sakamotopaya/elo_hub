"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class JenkinsUtilities {
    static getJenkinsConfig(config) {
        let jenkins;
        if (typeof config.featureSet.jenkins === "boolean") {
            let jenkinsEnabled = config.featureSet.jenkins;
            if (jenkinsEnabled) {
                if (!config.jenkins) {
                    jenkins = null;
                }
                else
                    jenkins = config.jenkins;
            }
            else {
                jenkins = null;
            }
        }
        else
            jenkins = config.featureSet.jenkins;
        return jenkins;
    }
}
exports.JenkinsUtilities = JenkinsUtilities;
;
class JenkinsBuild {
}
exports.JenkinsBuild = JenkinsBuild;
;
//# sourceMappingURL=jenkins.js.map