#!/usr/bin/env bash

set -e

export DEBIAN_FRONTEND=noninteractive

# TODO hello blabla
#  You need to have at least X GB of RAM to run this script.

echo "blabla"

# Check that we are on linux
if [[ "$OSTYPE" != "linux-gnu"* ]]; then
  echo "This script is only for linux"
  exit 1
fi


# Ask for the version
echo "What version do you want to install ? (default: 'latest')"
echo "You can find the list of versions here: https://github.com/PedakiHQ/pedaki/pkgs/container/pedaki/versions"
read -r PEDAKI_APP_VERSION
if [[ -z "$PEDAKI_APP_TAG" ]]; then
  PEDAKI_APP_TAG="latest"
  echo "Using default version: $PEDAKI_APP_TAG"
else
  echo "Using provided version: $PEDAKI_APP_TAG"
fi

# Ask for the domain
echo "What domain do you want to use ? (default: 'localhost')"
read -r DOMAIN
if [[ -z "$DOMAIN" ]]; then
  DOMAIN="localhost"
  echo "Using default domain: $DOMAIN"
else
  echo "Using provided domain: $DOMAIN"
fi

echo "Please enter your sudo password now:"
sudo echo ""

# Update apt
echo "Updating apt cache..."
sudo apt-get -qq update

# Clone app
echo "Installing pedaki app from github"
sudo apt-get install -y -qq git apt-utils gettext-base
git clone https://github.com/PedakiHQ/pedaki-community.git &> /dev/null || true
cd pedaki-community

# Pull latest changes if the repo already exists
if [[ "$PEDAKI_APP_TAG" == "latest" ]]; then
  echo "Pulling latest changes..."
  git checkout main &> /dev/null || true
  git pull &> /dev/null || true
else
  echo "Checking out version $PEDAKI_APP_TAG..."
  git fetch --all --tags &> /dev/null || true
  git checkout "$PEDAKI_APP_TAG"
fi
cd ..

# Add caddyfile (https://caddyserver.com/docs/automatic-https)
# TODO: use production letsencrypt
TLS_BLOCK="acme_ca https://acme-staging-v02.api.letsencrypt.org/directory"
rm -f Caddyfile
envsubst > Caddyfile <<EOF
{
$TLS_BLOCK
}
$DOMAIN, :80, :443 {
reverse_proxy http://web:8000
}
EOF

# TODO write env file
# db_pass = pedaki / db_host = db / db_port = 5432 / db_user = pedaki / db_name = pedaki / db_sslmode = disable
# Write .env file
envsubst > .env.production <<EOF
DOMAIN=$DOMAIN
EOF

# Setup docker (https://docs.docker.com/engine/install/ubuntu/)
echo "Installing docker..."
sudo apt-get install -y -qq ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get -qq update
sudo apt-get install -y -qq docker-ce docker-ce-cli containerd.io

# Start docker
echo "Configuring Docker Compose...."
rm -f docker-compose.yml
cp pedaki-community/docker-compose.yml docker-compose.yml.tmpl
envsubst < docker-compose.yml.tmpl > docker-compose.yml
rm docker-compose.yml.tmpl
echo "Starting Docker Compose...."
sudo -E docker-compose -f docker-compose.yml up -d

echo "Waiting for the app to be ready..."
echo "This can take a few minutes..."
bash -c 'while [[ "$(curl -s -o /dev/null -w ''%{http_code}'' localhost/_health)" != "200" ]]; do sleep 5; done'
echo "App is ready!"