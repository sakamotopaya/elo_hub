${1}/vsts login --token ${3}
${1}/vsts work item query --output json --instance {your-vsts-url-here} --project {your-project-name-here} --id ${4} > ${2}/active_tasks.json
