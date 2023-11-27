#!/bin/bash

# https://github.com/factorim/next-with-system-env

set +x # disable verbose mode
set +e # stop on error

# config
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
    envValue=$(env | grep "^$configName=" | grep -oe '[^=]*$');

    # if config found
    if [ -n "$configValue" ] && [ -n "$envValue" ]; then
      # replace all
      echo "+ Replace: ${configValue} with: ${envValue}"
      find $nextFolder \( -type d -name .git -prune \) -o -type f -print0 2> /dev/null | xargs -0 sed -i "s#$configValue#$envValue#g"
      export "$configName=$envValue"
      sed  "s#$configValue#$envValue#g" $envFilename > $envFilename.tmp
    else
      echo "- Not found: ${configValue}"
    fi
  done < $envFilename
  mv $envFilename.tmp $envFilename
  rm -f $envFilename.tmp
}

(test -f $envFilename -a -n $envFilename && echo "Found config file: $envFilename") || exit 1

apply_path || (echo "Error while applying path" && exit 1)

echo "Starting Nextjs"
exec "$@"