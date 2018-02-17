${1}/vsts login --token ${3}
${1}/vsts work item query --output json --instance https://karmak.visualstudio.com --project ElKamino --id ${4} > ${2}/active_tasks.json
