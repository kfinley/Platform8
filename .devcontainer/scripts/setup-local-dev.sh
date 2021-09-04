#!/bin/bash

# TODO: write a script to build out the .devcontainer setup.

# Pull latest:
#   - kfinley/aws-ses-local
#   - kfinley/cognito-local
#
# git submodule init
# git submodule update

alias init-auth=/workspace/.devcontainer/scripts/init-auth.sh
alias guid=pwsh --Command New-Guid | tr -d '\n' | tr -d 'Guid' | tr -d '\-\-\-\-'
aws s3api create-bucket --bucket uploads-transactions --region us-west-1 --create-bucket-configuration LocationConstraint=us-west-1 --profile s3local --endpoint-url http://platform8.s3:4569

