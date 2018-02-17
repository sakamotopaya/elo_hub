# elo_hub
Home Node Server - Runs on a PI

These are the things I think you need to do:
- Need mqtt server running.. you can test with mosquitto_pub and _sub
- npm install
- typescript
- elo_hub_cfg.json - sample in the repo. mostly mqtt config and paths
- vsts cli installed for the vsts integration stuff
- there are scripts that run. I am keeping mine in ~/.elo  (samples are in the script directory)



### Sample Hub Config
This file is not under 
```json
{
    "messaging": {
        "hubUrl": "mqtt://yourmqttserver",
        "listenerDisabled": false, 
        "listenerPattern": "elo/#"
    },
    "deviceRepo": {
        "repoPath": ""
    },
    "indicatorRepo": {
        "repoPath": ""
    },
    "animationRepo": {
        "repoPath": ""
    },
    "registerMapRepo": {
        "repoPath": ""
    },
    "vsts" : {
        "scriptPath" : "where your elo/vsts scripts are located",
        "dataPath" : "where you want hub to write results",
        "token" : "your key from vsts security",
        "vstsPath" : "path to vsts cli",
        "activeTasksQueryId" : "guid of the query that represents active tasks"
    }
}
```