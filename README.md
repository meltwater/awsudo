# awsudo

[![Build Status](https://cloud.drone.io/api/badges/meltwater/awsudo/status.svg)](https://cloud.drone.io/meltwater/awsudo)

A simple utility for easily executing AWS cli commands with an assumed role.

For more information about the motiviation behind developing this utility, please read our blog post [Assuming roles in AWS with sudo-like agility](http://underthehood.meltwater.com/blog/2018/01/22/assuming-roles-in-aws-with-sudo-like-agility/).

## Usage

```bash
awsudo [-d|--duration] [-p|--profile] [-n|--session-name] [-e|--external-id] [-v|--verbose]
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
  -p, --profile       The profile used to assume the role
                                                          [string] [default: ""]
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

#### Node.js

awsudo can also be installed for use by specific Node.js projects (i.e. as part
of a CI/CD build process) by adding it as a dependency like any other:

```bash
npm install --save-dev awsudo
```

npm will place it in the execution PATH for any scripts defined in
it package.json that it runs (e.g. start, test).

#### deb and rpm packages

In addition to the native npm package and Docker image, there are .deb and .rpm
packages avaialble.

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

> **Warning:** You must install Node.js separately, because these packages are not
> marked as dependent on Node.js within the Debian or Red Hat ecosystems. This
> facilitates portability across distributions and better accomodates the
> multitude of ways Node.js can be installed (e.g. using nvm).

#### Docker

awsudo can also be used from its official Docker image, which packages it along
with its dependencies and the AWS cli.

```bash
docker pull awsudo/awsudo
```

> **Note:** See Docker under Usage for details of what the image includes.

## Usage

Basic usage when awsudo is on the PATH resembles this example:

```bash
awsudo arn:aws:iam::123456789012:role/S3Access aws s3 cp ./some/directory s3://some-bucket
```

**💡 Tip: awsudo shell!**

When running multiple commands as the same role (especially when using MFA),
it can be convenient to temporarily authenticate all commands as that role by
launching a new shell using awsudo:

```bash
awsudo arn:aws:iam::123456789012:role/S3Access /bin/bash
aws s3 cp ./some/directory s3://some-bucket
aws s3 cp ./another/directory s3://some-bucket
aws s3api list-objects --bucket some-bucket
```

> **Note:** the lifespan of the authentication within the shell is dictated by
> the `--duration` argument to awsudo

### Docker

The Docker image can be used as a direct command:

```bash
docker run awsudo/awsudo awsudo --help
```

In order to assume roles, the AWS configuration needs to be mounted as a
volume in the container:

```bash
docker run -v ~/.aws:/root/.aws \
    awsudo/awsudo \
    awsudo arn:aws:iam::123456789012:role/S3Access aws s3 ls
```

If you need to operate on local files, those need to be mounted to a working
directory for the container as well:

```bash
docker run -v ~/.aws:/root/.aws awsudo/awsudo \
    --volume $PWD:/docker-working-directory --workdir /docker-working-directory \
    awsudo/awsudo \
    awsudo arn:aws:iam::123456789012:role/S3Access aws s3 cp ./some/directory s3://some-bucket
```

#### Docker image contents

The main focus of the Docker image is to provide awsudo, however it includes
some other tools that may be of use:

* `aws` - a key component for many uses of awsudo
* `node` - the runtime engine of awsudo itself
* an OS with a package manager to facilitate installing additional software

Each of these have their own releases which may affect a consumer of the awsudo
image. To provide a predictable environment for consumers we guarantee that,
starting with [v1.7.2]:

* an image for each version of awsudo is available
* an image for each active or maintenance [Node.js LTS] version is available
* an image for each combination of awsudo and Node.js LTS is available
* the latest release of the v2 AWS CLI will be included
    * See the legacy warning below for an exception
* the choice of base OS is tied to a Node.js LTS version

To allow selection across all of these possibilities, the awsudo image is
published with a selection of tags.

The table below illustrates what version of each tool can be expected
for a given image tag:

|         | `:latest` |`:vX.Y.Z` | `:nodeLTS` | `:vX.Y.Z-nodeLTS` |
| ------- | --------- | -------- | ---------- | ----------------- |
| awsudo  | latest    | vX.Y.Z   | latest     | vX.Y.Z            |
| aws     | 1.18.106  | 1.18.106 | latest v2  | latest v2         |
| Node.js | erbium    | erbium   | nodeLTS    | nodeLTS           |
| OS      | [alpine][alpine-docker] | [alpine][alpine-docker] | [debian][debian-docker] | [debian][debian-docker] |

> **Legacy erbium / aws v1 warning:**
>
> When this policy was enacted, Node.js Erbium was already EOL. However it was
> the basis of our only tags at the time: `:latest` and `vX.Y.Z`.
>
> To allow consumers to have a chance to migrate, that version is grandfathered
> until the start of LTS for Node.js v18 in October 2022 **and will continue to
> be the basis of the `:latest` and `vX.Y.Z` tags.**
>
> After that change, `vX.Y.Z` tags will reflect the latest Node.js LTS and
> `:latest` will reflect both the latest awsudo and Node.js LTS.

#### Docker-based CI/CD

The Docker image can also be used with CI/CD tools like [Drone](https://drone.io)
or [CircleCI](https://circleci.com/).

Here is an example **Drone** pipeline step which uses the awsudo Docker image to
deploy into AWS:

```yaml
deploy:
  image: awsudo/awsudo:gallium
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

### Valid AWS Configuration

Any one of the following is required for awsudo to function correctly

- Appropriate [environment variables are set](https://docs.aws.amazon.com/cli/latest/userguide/cli-environment.html) for aws-sdk to work
- A default profile (e.g. created using `aws configure`)
- A set of any named profiles you would like to use

## Developing / Testing

### validate-features

This is an included script which validates significant features of awsudo as
functioning properly in a true running context.

Not every feature that exists is, or should be, exercised by this tool. If a
unit test can adequately validate a given behavior, that is preferred.

Before running, it will check for prerequisites, but for the sake of planning
they are:

- Docker
- A post-`aws configure` environment with
    - at least one profile
    - at least one profile requiring an MFA

To execute the tool, run the following from the project root:

```
scripts/validate-features
```

it will prompt for profile names and MFA tokens as necessary.

## Contributing

[![Gitpod ready-to-code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/meltwater/awsudo)

Do we accept contributions? YES! (see our [policy](CONTRIBUTING.md) for details)

Thank you to everyone who has been one of our [contributors](CONTRIBUTORS.md)!

## Questions/Contact?

The maintainer of this repository is the [AWS sudo open source maintainers at Meltwater](mailto:awsudo.opensource@meltwater.com), please send us any questions.

[v1.7.2]: https://github.com/meltwater/awsudo/releases/tag/v1.7.2
[alpine-docker]: https://hub.docker.com/_/alpine
[debian-docker]: https://hub.docker.com/_/debian
[Docker tag ADR]: https://github.com/meltwater/awsudo/blob/master/docs/architecture/ADR_001_Latest_aws_and_nodejs_in_Docker.md
[Node.js LTS]: https://nodejs.org/en/about/releases/
