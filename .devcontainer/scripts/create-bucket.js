
const AWS = require('aws-sdk');
const fs = require('fs-extra');

const buckets = [
  {
    Bucket: 'test',
    // configs: [
    //   fs.readFileSync('./buckets/test/cors.xml'),
    // ],
  }];

const options = {
  host: 'platform8.s3',
  port: '4569',
  accessKeyId: 'S3RVER',
  secretAccessKey: 'S3RVER'
};

const s3Client = getClient();

function getClient() {
  return new AWS.S3({
    // s3ForcePathStyle: true,
    endpoint: new AWS.Endpoint(
      `http://${options.host}:${options.port}`,
    ),
    accessKeyId: options.accessKeyId,
    secretAccessKey: options.secretAccessKey,
    apiVersion: '2006-03-01',

  });
}

function createBuckets() {
  if (!buckets.length) {
    console.log('WARN: No buckets found to create');
    return Promise.resolve([]);
  }

  return Promise.all(
    buckets.map((bucket) => {
      console.log(`creating bucket: ${bucket.Bucket}`);

      return s3Client.createBucket(bucket).promise();
    }),
  ).catch((error) =>
    console.log(error)
  );
}

// s3Client.listBuckets(function(err, data) {
//   if (err) {
//     console.log("Error", err);
//   } else {
//     console.log("Success", data.Buckets);
//   }
// });

createBuckets();
