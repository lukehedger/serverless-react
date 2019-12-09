# AWS Infrastructure

Our AWS infrastructure is defined as code using the [AWS Cloud Development Kit (CDK)](https://aws.amazon.com/cdk/).

The infrastructure consists of a single AWS Lambda with an API Gateway interface and a DynamboDB table.

## Compile app

The CDK app is written in TypeScript. To compile the app to JavaScript run:

```sh
yarn build
```

## Deploy stack

To build the app, synthesize the CloudFormation template and deploy the stack run:

```sh
yarn deploy
```
