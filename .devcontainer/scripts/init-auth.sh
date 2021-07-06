#!/bin/bash

aws cognito-idp initiate-auth --client-id 77ten9enat274r0m7a21bw0n9 --auth-flow USER_PASSWORD_AUTH --auth-parameters USERNAME=$1,PASSWORD=$2 --endpoint-url http://platform8.cognito:9229
