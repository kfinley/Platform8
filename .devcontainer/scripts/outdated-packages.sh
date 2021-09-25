#!/bin/bash


for PACKAGE_PATH in packages/*; do
  IFS=/ read PACKAGE PACKAGE_NAME <<< $PACKAGE_PATH
  lerna --stream --scope=@platform8/$PACKAGE_NAME exec -- npm outdated
done

lerna --stream --scope=@platform8/accounts exec -- npm outdated
lerna --stream --scope=@platform8/transactions exec -- npm outdated
lerna --stream --scope=@platform8/websockets exec -- npm outdated

npm outdated
