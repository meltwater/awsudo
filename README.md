# awsudo
[![Build Status](https://travis-ci.org/meltwater/awsudo.svg?branch=master)](https://travis-ci.org/meltwater/awsudo)

A simple utility for easily executing AWS cli commands with an assumed role.

For more information about the motiviation behind developing this utility, please read our blog post [Assuming roles in AWS with sudo-like agility](http://underthehood.meltwater.com/blog/2018/01/22/assuming-roles-in-aws-with-sudo-like-agility/).

## Usage

```bash
awsudo arn:aws:iam::[AWS_ACCOUNT_ID]:role/[role name] [aws command]
```

### Install

awsudo can be installed as a global utility to use alongside the AWS cli for
day-to-day operations, local troubleshooting, etc:

```bash
npm install -g awsudo
```

#### Node

awsudo can also be installed for use by specific Node.js projects (i.e. as part
of a CI/CD build process) by adding it as a dependency like any other:

```bash
npm install --save-dev awsudo
```

npm will place it in the execution PATH for any scripts defined in
it package.json that it runs (e.g. start, test).

#### Docker

awsudo can also be used from its official Docker image, which packages it along
with its dependencies and the AWS cli.

```bash
docker pull awsudo/awsudo
```

The Docker image can be used as a direct command (remember to mount your AWS
configuration as a volume in the container):

```bash
docker run -v ~/.aws:/root/.aws awsudo/awsudo awsudo arn:aws:iam::[AWS_ACCOUNT_ID]:role/[role name] [aws command]
```

or it can be launched as an environment for running multiple commands
interactively:

```bash
docker run -it -v ~/.aws:/root/.aws awsudo/awsudo awsudo /bin/bash
```

### Example usages

#### Command

Basic usage when awsudo is on the PATH:

```bash
awsudo arn:aws:iam::123456789012:role/S3Access aws s3 cp ./some/directory s3://some-bucket
```

when using with Docker as a comment (i.e. not within the container):

```bash
docker run -v ~/.aws:/root/.aws awsudo/awsudo awsudo arn:aws:iam::123456789012:role/S3Access aws s3 cp ./some/directory s3://some-bucket
```

#### Docker-based CI/CD

The Docker image can also be used with CI/CD tools like [Drone](https://drone.io)
or [CircleCI](https://circleci.com/).

Here is an example **Drone** pipeline step which uses the awsudo Docker image to
deploy into AWS:

```yaml
  deploy:
    image: awsudo/awsudo:latest
    commands:
      # Copy build artifacts to publicly-readable S3 bucket
      - awsudo arn:aws:iam::${AWS_ACCOUNT_ID}:role/S3Access aws s3 cp ./build s3://some-bucket --acl public-read --recursive
    environment:
      - AWS_DEFAULT_REGION=us-east-1
    secrets:
      - aws_access_key_id
      - aws_account_id
      - aws_secret_access_key
```

## Prerequisites

* The awscli must be [configured](https://docs.aws.amazon.com/cli/latest/reference/configure/index.html) OR appropriate [environment variables are set](https://docs.aws.amazon.com/cli/latest/userguide/cli-environment.html)

**For npm-based installations:**

* This is a bash based package and must therefore be run in a bash environment
* The [awscli](https://aws.amazon.com/cli/) must be available on the system.

## Questions/Contact?
The maintainer of this repository is the [AWS sudo open source maintainers at Meltwater](mailto:awsudo.opensource@meltwater.com), please send us any questions.
