# Events API

This project is a simple example of a REST API with Node.js running on AWS Lambda and API Gateway using the Serverless Framework, with DynamoDB as a database.

It simulates a service that handles events with the following [model](src/models/event.ts).

## Structure

This API has 5 endpoints available that allow creating new events, as well as getting, updating or deleting existing ones. There is one Lambda function for each endpoint, and handler functions can be found under [src/functions](src/functions/) directory.

All queries that are executed on the DynamoDB database are part of [repository](src/common/event-repository.ts) file. DynamoDB Client from `@aws-sdk v3` is used.

## Error handling

For global error handling there is `catchErrors` Typescript decorator defined in [error.ts](src/common//error.ts) file, which is used on every Lambda handler and simplifies handling of error scenarios together with custom HTTP errors.

## Logging

All application logging is done using [Lambda Powertools](https://docs.powertools.aws.dev/lambda/typescript/latest/) Logger. It provides JSON output with different Lambda context fields available. Apart from Logger, Powertools package also contains other features that come along with Serverless best practices.

## Setup

To install required dependencies, run:

```
npm install
```

## Test

This projects contains unit tests and integration tests.

[Unit tests](test/unit/) do not cover the whole project, but only the most important parts like handling of CRUD operations on the database. They can be run with this command:

```
npm run test
```

[Integration tests](test/integration/) on the other hand make real HTTP requests to the API Gateway routes to test integration between real AWS resources - from API Gateway via Lambdas to DynamoDB, and back. Therefore, they require the application to be deployed first to a dedicated `test` environment. It can be done using this command:

```
serverless deploy --stage test
```

And then the tests can be run like this:

```
npm run test-integration
```

First step of the integration tests is the [setup script](test/integration/util/config.ts) that parses the output of the previous deployment, in order to get the API Gateway URL and DynamoDB table name.

## Deployment

In order to deploy the API to a development environment, you need to run the following command:

```
serverless deploy
```

`--stage dev` is an optional parameter, because the default stage is `dev` anyway.

After running deploy, you should see output similar to:

```
Deploying "events-api" to stage "dev" (eu-central-1)
✔ Service deployed to stack events-api-dev (35s)
endpoints:
  GET - https://xxxxxxx.execute-api.eu-central-1.amazonaws.com/dev/events
  GET - https://xxxxxxx.execute-api.eu-central-1.amazonaws.com/dev/events/{id}
  ...
```

## Pipeline

This project also contains a GitHub Actions CI/CD [pipeline](.github/workflows/pipeline.yml) that executes build, unit tests, deploy to `test` environment and integration tests, and finally deploy to `prod` environment.

To have access to target AWS account, it assumes an IAM role and gets short-lived AWS credentials. It uses GitHub OIDC under the hood.

The pipeline is triggered on git push to the main branch.

## Usage

It is possible to create, retrieve one or all, update and delete events.

### Create an event

```bash
curl -X POST https://xxxxxxx.execute-api.eu-central-1.amazonaws.com/dev/events --data '{ "name": "test event", "description": "test event description", "date": "2025-08-01" }'
```

Result:

```json
{
    "id": "81ceebfc-71ba-457e-8d3f-fbd48d1f7088",
    "name": "test event",
    "description": "test event description",
    "date": "2025-08-01",
    "createdAt": "2025-07-31T20:17:58.388Z"
}
```

### Get one event

```bash
curl https://xxxxxxx.execute-api.eu-central-1.amazonaws.com/dev/events/<id>
```

Result:

```json
{
    "createdAt": "2025-07-31T20:17:58.388Z",
    "date": "2025-08-01",
    "description": "test event description",
    "id": "81ceebfc-71ba-457e-8d3f-fbd48d1f7088",
    "name": "test event"
}
```

### Get all events

```bash
curl https://xxxxxxx.execute-api.eu-central-1.amazonaws.com/dev/events
```

Result:

```json
[
    {
        "createdAt": "2025-07-31T20:28:32.320Z",
        "date": "2025-08-02",
        "description": "test event description 2",
        "id": "27178dbd-427b-49da-af2c-925687180c46",
        "name": "test event 2"
    },
    {
        "createdAt": "2025-07-31T20:17:58.388Z",
        "date": "2025-08-01",
        "description": "test event description",
        "id": "81ceebfc-71ba-457e-8d3f-fbd48d1f7088",
        "name": "test event"
    }
]
```

### Update an event

```bash
 curl -X PUT https://xxxxxxx.execute-api.eu-central-1.amazonaws.com/dev/events --data '{"date":"2025-10-01","description":"test event description","id":"81ceebfc-71ba-457e-8d3f-fbd48d1f7088","name":"test event"}'
```

Result:

```json
{
    "createdAt": "2025-07-31T20:17:58.388Z",
    "date": "2025-10-01",
    "description": "test event description",
    "id": "81ceebfc-71ba-457e-8d3f-fbd48d1f7088",
    "name": "test event"
}
```

### Delete an event

```bash
 curl -X DELETE https://xxxxxxx.execute-api.eu-central-1.amazonaws.com/dev/events/<id>
```

Result: Empty
