VERSION=$1

if [ -z "$IMAGE_NAME" ]; then
  echo "IMAGE_NAME not set"
  exit 1
fi

if [ -z "$VERSION" ]; then
  echo "No version specified, using package.json version"
  VERSION=$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d ' ')
fi

echo "Version: ${VERSION}"

docker build . --tag $IMAGE_NAME:latest -f ./app/Dockerfile

docker push $IMAGE_NAME:latest
docker tag $IMAGE_NAME:latest $IMAGE_NAME:${VERSION}
docker push $IMAGE_NAME:${VERSION}