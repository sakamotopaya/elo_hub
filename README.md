# elo_hub
Home Node Server - Runs on a PI

These are the things I think you need to do:
- Need mqtt server running.. you can test with mosquitto_pub and _sub
- npm install
- typescript
- elo_hub_cfg.json - sample in the repo. mostly mqtt config and paths
- vsts cli installed for the vsts integration stuff
- there are scripts that run. I am keeping mine in ~/.elo  samples are in the script directory



```json
{
    "messaging": {
        "hubUrl": "mqtt://pi3_hub",
        "listenerDisabled": false,
        "listenerPattern": "elo/#"
    },
    "deviceRepo": {
        "repoPath": "sample_files"
    },
    "indicatorRepo": {
        "repoPath": "sample_files"
    },
    "animationRepo": {
        "repoPath": "sample_files"
    },
    "registerMapRepo": {
        "repoPath": "sample_files"
    },
    "vsts" : {
        "scriptPath" : "./scripts/dev",
        "dataPath" : "/Users/sakamoto/.elo",
        "token" : "your key from vsts security",
        "vstsPath" : "/Users/sakamoto/bin",
        "activeTasksQueryId" : "guid of the query that represents active tasks"
    }
}
```