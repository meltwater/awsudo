# awsudo
[![Build Status](https://travis-ci.org/meltwater/awsudo.svg?branch=master)](https://travis-ci.org/meltwater/awsudo)

A simple utility for executing cli commands with an assumed role. 

For more information about the motiviation behind developing this utility, please read our blog post [Assuming roles in AWS with sudo-like agility](http://underthehood.meltwater.com/blog/2018/01/22/assuming-roles-in-aws-with-sudo-like-agility/).

## Install

[![NPM](https://nodei.co/npm/awsudo.png)](https://nodei.co/npm/awsudo/after.png?downloads=true&downloadRank=true&stars=true)

## Usage

```bash
awsudo arn:aws:iam::[AWS_ACCOUNT_ID]:role/[role name] [aws command]
```

### Example usage

```bash
awsudo arn:aws:iam::123456789012:role/S3Access aws s3 cp ./some/directory s3://some-bucket
```

## Prerequisites

* This is a bash based package and must therefore be run in a bash environment
* The [awscli](https://aws.amazon.com/cli/) must be available on the system.
* The awscli must be [configured](https://docs.aws.amazon.com/cli/latest/reference/configure/index.html) OR appropriate [environment variables are set](https://docs.aws.amazon.com/cli/latest/userguide/cli-environment.html)

## Questions/Contact?
The maintainer of this repository is the [AWS sudo open source maintainers at Meltwater](mailto:awsudo.opensource@meltwater.com), please send us any questions.
