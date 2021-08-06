#!/bin/bash

# Check if vsdbg is present. If it is then we're in an existing devcontainer that's been setup
if ! [ -f "./.devcontainer/vsdbg/vsdbg" ]; then

    # Set the runtime to linux-musl-x64 since we're using alpine images to run dotnet services in devcontainer
    curl -sSL https://aka.ms/getvsdbgsh | bash /dev/stdin -v latest -r linux-musl-x64 -l ./.devcontainer/vsdbg

    # Pull down submodules (customized serverless-offline plugins)
    git submodule update --init --recursive

else
    echo "Existing dev container... skipping installs."
fi
