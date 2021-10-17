#!/usr/bin/env node

const AWS = require("aws-sdk");
const { execSync } = require("child_process");
const { isRoleArn } = require('./is-role-arn');
const {
    DEFAULT_DURATION,
    DEFAULT_EXTERNAL_ID,
    DEFAULT_MFA_TOKEN,
    DEFAULT_MFA_TOKEN_ARN,
    DEFAULT_PROFILE,
    DEFAULT_ROLE_ARN,
    DEFAULT_SESSION_NAME,
    DEFAULT_VERBOSE_VALUE,

    ERROR_CONFLICTING_ROLE_ARN_AND_PROFILE,
    ERROR_INCOMPLETE_MFA_OPTIONS,
    ERROR_INVALID_ROLE_ARN,
    ERROR_MISSING_ROLE_ARN_AND_PROFILE,

    NO_EXTERNAL_ID,
    NO_MFA_TOKEN,
    NO_MFA_TOKEN_ARN,
    NO_ROLE_ARN,

    Options
} = require('./options');

function extractPositionalOptions (positionals) {
    const roleArn = isRoleArn(positionals[0]) ? positionals[0] : NO_ROLE_ARN;
    const command = roleArn !== NO_ROLE_ARN ? positionals.slice(1) : positionals;

    return {
        command,
        roleArn
    };
}

const yargsv = require("yargs")(process.argv.slice(2))
    .usage(
        "$0 [-d|--duration] [-p|--profile] [-n|--session-name] [-e|--external-id] [-v|--verbose] [-m|--mfa-token-arn] [-t|--mfa-token] [arn] <command..>",
        "Assume an IAM role for the duration of a command",
        yargs => {
            yargs
                .option("d", {
                    alias: "duration",
                    describe:
                        "The duration to assume this role in seconds. See https://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRole.html#API_AssumeRole_RequestParameters",
                    default: DEFAULT_DURATION,
                    type: "number"
                })
                .option("p", {
                    alias: "profile",
                    describe: "The profile used to assume the role",
                    default: DEFAULT_PROFILE,
                    type: "string"
                })
                .option("n", {
                    alias: "session-name",
                    describe: "The role session name to use",
                    default: DEFAULT_SESSION_NAME,
                    type: "string"
                })
                .option("e", {
                    alias: "external-id",
                    describe: "The external id string used to authenticate role assumption",
                    default: DEFAULT_EXTERNAL_ID,
                    type: "string"
                })
                .option("v", {
                    alias: "verbose",
                    describe: "Show debug information",
                    default: DEFAULT_VERBOSE_VALUE,
                    type: "boolean"
                })
                .option("t", {
                    alias: "mfa-token",
                    describe: "Current MFA token [Must also supply mfa-token-arn]",
                    default: DEFAULT_MFA_TOKEN,
                    type: "string"
                })
                .option("m", {
                    alias: "mfa-token-arn",
                    describe: "ARN for users MFA [Must also supply mfa-token]",
                    default: DEFAULT_MFA_TOKEN_ARN,
                    type: "string"
                })
                .positional("arn", {
                    default: DEFAULT_ROLE_ARN,
                    describe: "ARN to assume",
                    type: "string"
                })
                .positional("command", {
                    describe: "Command to run",
                    type: "array"
                });
        }
    ).argv;

let options;
try {
    options = new Options({
        ...yargsv,
        ...extractPositionalOptions(yargsv.command)
    });
}
catch (error) {
    switch (error.errorType) {
        case ERROR_CONFLICTING_ROLE_ARN_AND_PROFILE:
            console.log('Only one of a role arn or a profile can be specified');
            break;
        case ERROR_INCOMPLETE_MFA_OPTIONS:
            console.error(`To use MFA you must supply both --mfa-token-arn and --mfa-token. Missing value: ${error.errorDetail}`);
            return;
        }
        case ERROR_INVALID_ROLE_ARN:
            console.log(`Invalid role arn provided. Provided value: ${error.errorDetail}`);
            break;
        case ERROR_MISSING_ROLE_ARN_AND_PROFILE:
            console.log('Either a role arn or a profile must be specified');
            break;
        default:
            console.log('An unknown error occurred.', error.message);
            break;
    }

    process.exit(1);
}

console.log('options', options);

// TODO: Separate CLI entry from awsudo core logic
if (options.verbose) {
    if (options.roleArn !== NO_ROLE_ARN) {
        console.log(`Using RoleArn: ${options.roleArn}`);
    }
    else {
        console.log(`Using Profile: ${options.profile}`);
    }
}

(async () => {
    let command;
    let credentials;
    const stsOptions = {};

    try {
        const assumeRoleParameters = {
            RoleSessionName: options.sessionName,
            DurationSeconds: options.duration
        };

        if (options.roleArn) {
            assumeRoleParameters.RoleArn = options.roleArn;
        }

        if (options.externalId) {
            assumeRoleParameters.ExternalId = options.externalId;
        }

        if (options.mfaToken && options.mfaTokenArn) {
            assumeRoleParameters.SerialNumber = options.mfaTokenArn;
            assumeRoleParameters.TokenCode = options.mfaToken;
            stsOptions.correctClockSkew = true;
        }

        if (options.profile) {
            AWS.config.credentials = new AWS.SharedIniFileCredentials({ profile: options.profile });
        }

        const sts = new AWS.STS(stsOptions);
        const data = await sts
            .assumeRole(assumeRoleParameters)
            .promise();
        credentials = data.Credentials;
    } catch (err) {
        console.log("Exception while assuming role:", err);
        process.exit(1);
    }

    const commandArgs = [
        ["AWS_ACCESS_KEY_ID", credentials.AccessKeyId],
        ["AWS_SECRET_ACCESS_KEY", credentials.SecretAccessKey],
        ["AWS_SESSION_TOKEN", credentials.SessionToken],
        ["AWS_EXPIRATION", credentials.Expiration.toISOString()]
    ]
        .map(arr => arr.join("="));

    if (process.platform === "win32") {
        command = commandArgs
            .map((arr) => `SET "${arr}"`)
            .concat(options.command.join(" "))
            .join(" & ");
    }
    else {
        command = commandArgs.concat(options.command.join(" "));
    }

    if (options.verbose) {
        console.log(`Running command ${command}`);
    }

    execSync(command, { stdio: "inherit" });
})().catch(err => {
    if (options.verbose) {
        const maskedError = err.replace(/(AWS_\w+?=)(\S+)/g, '$1XXXXXXXXXXXXXXXXXXXX');
        console.log("Caught runtime exception:", maskedError);
    }

    process.exit(1);
});
