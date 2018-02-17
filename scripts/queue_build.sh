${1}/vsts login --token ${3}
${1}/vsts build queue --output json --instance https://karmak.visualstudio.com --project ElKamino --definition-name ${4} > ${2}/queue_build_result.json
