${1}/vsts login --token ${3} 
${1}/vsts build list --output json --instance {your-vsts-url-here} --project {your-project-name-here} --top 1 > ${2}/build_status.json
