# awsudo

[![Build Status](https://cloud.drone.io/api/badges/meltwater/awsudo/status.svg)](https://cloud.drone.io/meltwater/awsudo)

A simple utility for easily executing AWS cli commands with an assumed role.

For more information about the motiviation behind developing this utility, please read our blog post [Assuming roles in AWS with sudo-like agility](http://underthehood.meltwater.com/blog/2018/01/22/assuming-roles-in-aws-with-sudo-like-agility/).

## Usage

```bash
awsudo [-d|--duration] [-n|--session-name] [-e|--external-id] [-v|--verbose]
[-m|--mfa-token-arn] [-t|--mfa-token] <arn> <command..>

Assume an IAM role for the duration of a command

Positionals:
  arn      ARN to assume                                                [string]
  command  Command to run

Options:
  --help               Show help                                       [boolean]
  --version            Show version number                             [boolean]
  -d, --duration       The duration to assume this role in seconds. See
                       https://docs.aws.amazon.com/STS/latest/APIReference/API_A
                       ssumeRole.html#API_AssumeRole_RequestParameters
                                                         [number] [default: 900]
  -n, --session-name   The role session name to use
                                               [string] [default: "RoleSession"]
  -e, --external-id    The external id string used to authenticate role
                       assumption                      [string] [default: false]
  -v, --verbose        Show debug information         [boolean] [default: false]
  -t, --mfa-token      Current MFA token [Must also supply mfa-token-arn]
                                                       [string] [default: false]
  -m, --mfa-token-arn  ARN for users MFA [Must also supply mfa-token]
                                                       [string] [default: false]
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

#### deb and rpm packages

In addition to the native npm package and Docker image, there are .deb and .rpm
packages avaialble.

> **Warning:** You must install Node.js separately, because these packages are not
> marked as dependent on Node.js within the Debian or Red Hat ecosystems. This
> facilitates portability across distributions and better accomodates the
> multitude of ways Node.js can be installed (e.g. using nvm).

These can be downloaded from

1. the [releases tab](https://github.com/meltwater/awsudo/releases) in your browser
2. the command-line:

    **Latest .deb**
    ```bash
    curl -LO $(curl -s https://api.github.com/repos/meltwater/awsudo/releases/latest | grep -Eo 'https://github\.com/meltwater/awsudo/releases/download/v.*\.deb')
    ```

    **Latest .rpm**
    ```bash
    curl -LO $(curl -s https://api.github.com/repos/meltwater/awsudo/releases/latest | grep -Eo 'https://github\.com/meltwater/awsudo/releases/download/v.*\.rpm')
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

## Contributing

[![Gitpod ready-to-code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/meltwater/awsudo)

Do we accept contributions? YES! (see our [policy](CONTRIBUTING.md) for details)

Thank you to everyone who has been one of our [contributors](CONTRIBUTORS.md)!

## Questions/Contact?

The maintainer of this repository is the [AWS sudo open source maintainers at Meltwater](mailto:awsudo.opensource@meltwater.com), please send us any questions.
