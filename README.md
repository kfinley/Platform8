## Platform8 - Sample System

This is sample code showing a cloud based platform using a hybrid of Server and Serverless back end built using C# [.NET Core](https://github.com/dotnet/core) and TypeScript with a [VueJs](https://github.com/vuejs/vue) front end.

This is a work in progress system and currently contains features for managing a personal financial budget and expense tracking.

This repository intended to be run locally using [VSCode Dev Containers](https://code.visualstudio.com/docs/remote/create-dev-container) or [GitHub Codespaces](https://github.com/features/codespaces) and can be deployed to AWS.


### Steps to run

1. Open as VSCode Dev Container or GitHub Codespace Container
2. Forward ports (see below)
3. Open browswer to http://localhost:8080

### Overview

This is a monorepo that contains both front end and back end components. The main structure of the repo is as follows:

```
├── .devcontainer
├── dotnet
├── packages
├── scripts
└── services
```

##### .devcontainer
This directory contains VS Code development container files as well as resources used for running the full platfoorm stack locally using Serverless Offline.

##### dotnet
This directory contains shared .NET Core projects.

##### packages
This directory contains any shared TypeScript projects as well as front end client packages.

##### scripts
This directory contains scripts used for running services locally using Serverless Offline.

TODO: These scripts should move to .devcontainer/scripts

##### services
This directory contains any back end services. These are logically grouped services that written in C# running as a .net core api in a container or serverless functions written in C# or TypeScript.

### Front End - VueJs / Vuex / TypeScript
The front end is built as a component based system using VueJs 2, Vuex, Bootstrap 5, and TypeScript.

Components are grouped by domain and built as seperate Vue plugins. These plugins are loaded by a Vue client in order to expose features as a product.

Storybooks are used for design, development, testing, and review of all individual UX components.

Jest is used for unit testing of Vue UI components, Vuex store modules, and shared packages.

### Back End - TypeScript & C#
The back end is built using serverless and container based APIs using TypeScript and C# dotnet core.

At a high level the back end looks like this...

* Lambda : TypeScript & C#
* REST APIs : C#
* WebSockets : TypeScript
* Messaging : SNS / SES
* Serverless Orchestration : AWS Step Functions
* Data : S3, MySql, DynamoDB
* Auth : Cognito

### Local Development

In order to have a close match between Production and Development code execution paths all cloud based process flows and systems are run locally using various open source projects and AWS provided components.

The back end systems are run in containers as either dotnet core 5.0 AspNetCore.Mvc based APIs, AWS service stand-ins, or using Serverless Offline to memic AWS Lambda, API Gateway, and other required services.

##### Serverless Offline
A [customized version of Serverless Offline](https://github.com/kfinley/serverless-offline) that has dotnet core Lambda Function execution support is being used and is referenced as a git submodule.

A container (platform8.sls) is configured to run the platform locally. The platform is defined using serverless.yml and various cloud resource files located in each service directory (more info below).

Serverless is configured to use several plugins:
- [serverless-webpack](https://github.com/serverless-heaven/serverless-webpack)
- [serverless-dynamodb-local](https://github.com/99x/serverless-dynamodb-local)
- [serverless-offline-sns](https://github.com/mj1618/serverless-offline-sns)
- [serverless-s3-local](https://github.com/ar90n/serverless-s3-local)
- [serverless-step-functions](https://github.com/serverless-operations/serverless-step-functions)
- [serverless-offline-stepfunctions-plugin](https://github.com/pianomansam/serverless-offline-stepfunctions-plugin)
- [serverless-offline](https://github.com/dherault/serverless-offline)

A [customized version of cognito-local](https://github.com/kfinley/cognito-local) is being used and is referenced as a git submodule.

A [customized version of aws-ses-local](https://github.com/kfinley/aws-ses-local) is being used and is referenced as a git submodule.

In addition to a container running Serverless Offline there are several other containers running as stand ins for AWS services. These include:
- platform8.cognito (Cognito : Auth)
- platform8.ses (Simple Email Services)
- platform8.sfn (AWS Step Functions)
- platform8.dynamodb (AWS DynamoDB)
- platform8.dynamodb.admin (DynamoDB Admin Console)
- platform8.mysql (AWS RDS)

The front end Vue client is run in a container (platform8.web) using [Vite](https://github.com/vitejs/vite).

##### TypeScript project management
[Lerna](https://github.com/lerna/lerna) is used to manage code sharing across all javascript based projects.

This includes packages located under the `packages` and `services` folders.

##### .net core debugging
Each .net based service is running in it's own container and can be attached to for debugging. There are VSCode tasks configured to attach each service to it's corresponding container. More info on attaching to a remote container can be found [here](https://code.visualstudio.com/docs/remote/attach-container).

These containers are not currently set to auto restart on changes so the container must be restarted and debugger reattached after code is modified.

Each service can also be launched locally. In this case stop the container running the service then select the desired 'Launch #SERVICE_NAME# Api' VSCode task.

#### Services Cloud Config
Each service has it's resources defined in various files located under an `infrastructure` folder.

These files include:
```
├── environment.yml
├── functions.yml
├── resources.yml
└── stateMachines.yml
```

##### environment.yml
Contains environment variables to be loaded for any Lambda Function or container.

##### functions.yml
Contains service Lambda Function definitions

##### resources.yml
Contains cloud resource definitions such as DynamoDB Tables, SNS Topics/Subscriptions, S3 buckets, etc.

##### stateMachines.yml
Contains AWS StepFunction definitions

### Storybooks
Each Vue plugin package has it's own [Storybook](https://github.com/storybookjs/storybook) configured.

During local development a specific storybook can be run in order to be viewed in the browser or preview in VSCode using [VSCode Story Explorer](https://github.com/joshbolduc/vscode-story-explorer)

A container is built (platform8.storybooks) that runs a combined static instance of all the storybooks using [Storybook Deployer](https://github.com/storybookjs/storybook-deployer) and the monorepo option.

### GitHub Codespaces Port Forwarding
When running on GitHub Codespaces port forwarding must be configured manually.

Ports:
* 3001 - WebSockets
* 4569 - S3
* 5000 - User API
* 5001 - Accounts API
* 5002 - Transactions API
* 5003 - Budgets API
* 5004 - Expenses API
* 8001 - DynamoDb Admin
* 8080 - Vue Web Client
* 9229 - Cognito
