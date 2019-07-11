${1}/vsts login --token ${3} 
${1}/vsts build list --output json --instance https://karmak.visualstudio.com --project ElKamino --top 1 > ${2}/build_status.json
