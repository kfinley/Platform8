aws s3api create-bucket --bucket uploads-transactions --region us-west-1 --profile s3local --endpoint-url http://platform8.s3:4569
aws s3api put-bucket-cors --bucket uploads-transactions --cors-configuration file://uploads-transactions.cors.json --region us-west-1 --profile s3local --endpoint-url http://platform8.s3:4569
