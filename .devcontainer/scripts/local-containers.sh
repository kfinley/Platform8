#!/bin/bash

OPERATION=$1

if [ operation = '' ]; then

$OPERATION=start

fi

docker $OPERATION platform8.accounts
docker $OPERATION platform8.budgets
docker $OPERATION platform8.expenses
docker $OPERATION platform8.transactions
docker $OPERATION platform8.user
docker $OPERATION platform8.sls
docker $OPERATION platform8.web
docker $OPERATION platform8.storybooks
