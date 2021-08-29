#!/bin/bash

DOCKER_VERSION=$(docker -v)

if [[ $DOCKER_VERSION == "Docker version"* ]]; then
    echo "Docker is currently installed."
else
    echo "Docker is currently not installed."
fi
