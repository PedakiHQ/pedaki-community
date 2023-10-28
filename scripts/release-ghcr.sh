VERSION=$1

if [ -z "$VERSION" ]; then
  echo "No version specified, using package.json version"
  VERSION=$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d ' ')
fi

echo "Version: ${VERSION}"

docker build . --tag ghcr.io/pedakihq/pedaki:latest -f ./app/Dockerfile

docker push ghcr.io/pedakihq/pedaki:latest
docker tag ghcr.io/pedakihq/pedaki:latest ghcr.io/pedakihq/pedaki:${VERSION}
docker push ghcr.io/pedakihq/pedaki:${VERSION}