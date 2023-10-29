current_version=$(jq -r '.version' package.json)
echo "Current version: $current_version"

package_json=$(
  find . -name package.json \
  -not -path "**/node_modules/*" \
  -not -path "**/.yalc/*" \
  -not -path "**/.next/*" \
)

echo "> Updating package.json files"
#for file in $package_json; do
#  package_name=$(jq -r '.name' $file)
#  echo "Updating $package_name to $current_version"
#  jq '.version = $version' --arg version $current_version $file | sponge $file
#  # update dependencies starting with @pedaki
#  sed  "s/\(\"@pedaki\/[^\"]*\": \"\)[^\"]*\"/\1$current_version\"/" package.json | sponge package.json
#done

echo "> Updating lock file"
pnpm install > /dev/null

echo "Done!"