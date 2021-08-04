#!/bin/bash


echo
echo "Running dev initialization script..."
echo

# Open up docker socket for docker-in-docker as non-root
sudo chmod 777 /var/run/docker-host.sock

# If this is a new container then node_modules will not be there
if ! [ -d "./node_modules" ]; then

    npm install

    lerna bootstrap

    # Install .net 3.1 for building lambda packages
    curl -sSL https://dot.net/v1/dotnet-install.sh | bash /dev/stdin --runtime aspnetcore --version 3.1.17

    # Install addition .net tools (ef, lambda, etc.)
    ./.devcontainer/scripts/install-dotnet-tools.sh

    # build .net bits
    # Important to build lambda packages first b/c they use 3.1.
    # If done after building the solution then 3.1 dlls will be left
    # in some locations used by 5.0 services.
    npm run dotnet:package:accounts

    dotnet build ./services/services.sln

    # ensure services, sls, and vite dev client are started
    npm run docker:services:restart

else
    echo "Existing dev container... skipping installs."
fi
