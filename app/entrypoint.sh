#!/bin/bash

# https://github.com/factorim/next-with-system-env

set +x # disable verbose mode
set +e # stop on error

# config
envFilenameTmp='.env.production.tmp'
envFilename='.env.production'
nextFolder='./.next/'
function apply_path {
  # read all config file
  while read -r line; do
    # no comment or not empty
    if [ "${line:0:1}" == "#" ] || [ "${line}" == "" ]; then
      continue
    fi

    # split
    configName="$(cut -d'=' -f1 <<<"$line")"
    configValue="$(cut -d'=' -f2 <<<"$line")"
    # get system env
    possibleName="$(echo "$configValue" | sed -e 's/{{{//' -e 's/}}}//')"
    envFromName=$(env | grep "^$configName=" | sed -e 's/^[^=]*=//');
    envFromValue=$(env | grep "^$possibleName=" | sed -e 's/^[^=]*=//');
    # take the first found
    envValue="${envFromName:-$envFromValue}"

    # if config found
    if [ -n "$configValue" ] && [ -n "$envValue" ]; then
      # replace all
      echo "+ Replace: ${configName} - ${configValue}"
      find $nextFolder \( -type d -name .git -prune \) -o -type f -print0 2> /dev/null | xargs -0 sed -i "s#$configValue#$envValue#g"

      echo "$configName=$envValue" >> $envFilename
      export "$configName=$envValue"
    else
      echo "- Not found: ${configValue}"
    fi
  done < $envFilenameTmp
}

(test -f $envFilenameTmp -a -n $envFilenameTmp && echo "Found config file: $envFilenameTmp") || exit 1

apply_path || (echo "Error while applying path" && exit 1)

echo "Starting Nextjs"
exec "$@"