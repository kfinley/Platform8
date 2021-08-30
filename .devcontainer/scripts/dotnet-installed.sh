#!/bin/bash

DOTNET_SDKS=$(dotnet --list-sdks)

if [[ $DOTNET_SDKS == *"3.1"* ]]; then
    echo 'dotnet 3.1 installed'
fi

if [[ $DOTNET_SDKS == *"5.0"* ]]; then
     echo 'dotnet 5.0 installed'
fi

DOTNET_LAMBDA=$(dotnet lambda)

if [[ $DOTNET_LAMBDA == *"Amazon Lambda Tools for .NET Core applications"* ]]; then
  echo "dotnet lambda tools installed"
fi

