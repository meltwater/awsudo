# awsudo

[![Build Status](https://cloud.drone.io/api/badges/meltwater/awsudo/status.svg)](https://cloud.drone.io/meltwater/awsudo)

A simple utility for easily executing AWS cli commands with an assumed role.

For more information about the motiviation behind developing this utility, please read our blog post [Assuming roles in AWS with sudo-like agility](http://underthehood.meltwater.com/blog/2018/01/22/assuming-roles-in-aws-with-sudo-like-agility/).

## Usage

```bash
awsudo [-d|--duration] [-v|--verbose] <arn> <command..>

Assume an IAM role for the duration of a command

Positionals:
  arn      ARN to assume                                                [string]
  command  Command to run

Options:
  --help          Show help                                            [boolean]
  --version       Show version number                                  [boolean]
  -d, --duration  The duration to assume this role in seconds. See
                  https://docs.aws.amazon.com/STS/latest/APIReference/API_Assume
                  Role.html#API_AssumeRole_RequestParameters
                                                         [number] [default: 900]
  -v, --verbose   Show debug information              [boolean] [default: false]
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

#### .deb package

We provide

Two options:
1. Download it in your browser from the [releases tab](https://github.com/meltwater/awsudo/releases)
2. From the command-line:
```bash
LATEST_RELEASE_URL=$(curl -s https://api.github.com/repos/meltwater/awsudo/releases/latest | grep -Eo 'https://github\.com/meltwater/awsudo/releases/download/v.*\.deb')
LATEST_RELEASE_FILE=${LATEST_RELEASE_URL##*/}
curl $LATEST_RELEASE_URL -o $LATEST_RELEASE_FILE
dpkg -i $LATEST_RELEASE_FILE
```

### Example usages

#### Command

Basic usage when awsudo is on the PATH:

```bash
awsudo arn:aws:iam::123456789012:role/S3Access aws s3 cp ./some/directory s3://some-bucket
```

when using with Docker as a command (i.e. not within the container):

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

- Appropriate [environment variables must be set](https://docs.aws.amazon.com/cli/latest/userguide/cli-environment.html) for aws-sdk to work.

## Thanks to all of our contributors!

[Contributors list](CONTRIBUTORS.md)

## Questions/Contact?

The maintainer of this repository is the [AWS sudo open source maintainers at Meltwater](mailto:awsudo.opensource@meltwater.com), please send us any questions.
