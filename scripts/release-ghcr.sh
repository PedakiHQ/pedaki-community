set -e # stop on error

VERSION=$1

if [ -z "$IMAGE_NAME" ]; then
  echo "IMAGE_NAME not set"
  exit 1
fi

if [ -z "$VERSION" ]; then
  echo "No version specified, using package.json version"
  VERSION=$(cat app/package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d ' ')
fi

TAG='latest'
if [[ $VERSION == *"-beta"* ]]; then
  TAG='beta'
fi

echo "Version: ${VERSION}"
echo "Tag: ${TAG}"

docker build . --tag $IMAGE_NAME:$TAG -f $DOCKERFILE

docker push $IMAGE_NAME:$TAG
docker tag $IMAGE_NAME:$TAG $IMAGE_NAME:${VERSION}
docker push $IMAGE_NAME:${VERSION}