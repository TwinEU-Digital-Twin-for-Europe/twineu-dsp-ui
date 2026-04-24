#!/bin/sh
for i in $(env | grep APP_)
do
    key=$(echo $i | cut -d '=' -f 1)
    value=$(echo $i | cut -d '=' -f 2-)
    
    value="${value//_/ }"

    if [[ "$value" == "true" || "$value" == "false" ]]; then
        find /usr/share/nginx/html -type f -name '*.js' -exec sed -i "s|\"${key}\"|${value}|g" '{}' +
    else
        find /usr/share/nginx/html -type f -name '*.js' -exec sed -i "s|${key}|${value}|g" '{}' +
    fi
    #find /usr/share/nginx/html -type f -name '*.js' -exec sed -i "s|${key}|${value}|g" '{}' +
done

 

# https://pamalsahan.medium.com/dockerizing-a-react-application-injecting-environment-variables-at-build-vs-run-time-d74b6796fe38