#!/usr/bin/env node

const AWS = require("aws-sdk");
const { execSync } = require("child_process");
const { getProfileList } = require('./get-profile-list');
const { getProfileOptionsValues } = require('./get-profile-options-values');
const { isRoleArn } = require('./is-role-arn');
const { objectEntriesFilter } = require('./object-entries-filter');
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
    NO_PROFILE,
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
                    describe: "The profile used to assume the role. Any profile values will override default values. Any explicit options will override profile values.",
                    default: DEFAULT_PROFILE,
                    choices: [DEFAULT_PROFILE, ...getProfileList()]
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
(async () => {
    const specifiedOptions = objectEntriesFilter(yargsv, {
            duration: DEFAULT_DURATION,
            externalId: DEFAULT_EXTERNAL_ID,
            mfaToken: DEFAULT_MFA_TOKEN,
            mfaTokenArn: DEFAULT_MFA_TOKEN_ARN,
            sessionName: DEFAULT_SESSION_NAME,
            verbose: DEFAULT_VERBOSE_VALUE
    });
    const positionalOptions = objectEntriesFilter(extractPositionalOptions(yargsv.command), { roleArn: NO_ROLE_ARN });
    const profileOptionsValues = yargsv.profile !== NO_PROFILE ? getProfileOptionsValues(yargsv.profile) : {};

    try {
        options = new Options({
            ...profileOptionsValues,
            ...specifiedOptions,
            ...positionalOptions
        });

        if (options.verbose) {
            console.log('options', options);
        }
    }
    catch (error) {
        switch (error.errorType) {
            case ERROR_CONFLICTING_ROLE_ARN_AND_PROFILE:
                console.log('Only one of a role arn or a profile can be specified');
                break;
            case ERROR_INCOMPLETE_MFA_OPTIONS:
                console.error(`To use MFA you must supply both --mfa-token-arn and --mfa-token. Missing value: ${error.errorDetail}`);
                break;
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

    if (options.verbose) {
        if (options.roleArn !== NO_ROLE_ARN) {
            console.log(`Using RoleArn: ${options.roleArn}`);
        }

        if (options.profile !== NO_PROFILE) {
            console.log(`Using Profile: ${options.profile}`);
        }
    }

    const assumeRoleParameters = {
        RoleSessionName: options.sessionName,
        DurationSeconds: options.duration,
        RoleArn: options.roleArn
    };

    if (options.externalId !== NO_EXTERNAL_ID) {
        assumeRoleParameters.ExternalId = options.externalId;
    }

    const stsOptions = {};
    if (options.mfaToken !== NO_MFA_TOKEN && options.mfaTokenArn !== NO_MFA_TOKEN_ARN) {
        assumeRoleParameters.SerialNumber = options.mfaTokenArn;
        assumeRoleParameters.TokenCode = options.mfaToken;
        stsOptions.correctClockSkew = true;
    }

    let awsEnvironmentSetCommands;
    try {
        const sts = new AWS.STS(stsOptions);
        const data = await sts
            .assumeRole(assumeRoleParameters)
            .promise();
        const credentials = data.Credentials;

        awsEnvironmentSetCommands = [
            ["AWS_ACCESS_KEY_ID", credentials.AccessKeyId],
            ["AWS_SECRET_ACCESS_KEY", credentials.SecretAccessKey],
            ["AWS_SESSION_TOKEN", credentials.SessionToken],
            ["AWS_EXPIRATION", credentials.Expiration.toISOString()]
        ]
        .map(arr => arr.join("="));
    } catch (err) {
        console.log("Exception while assuming role:", err);
        process.exit(1);
    }

    let command;
    if (process.platform === "win32") {
        command = awsEnvironmentSetCommands
            .map((arr) => `SET "${arr}"`)
            .concat(options.command.join(" "))
            .join(" & ");
    }
    else {
        command = awsEnvironmentSetCommands
            .concat(options.command)
            .join(" ");
    }

    if (options.verbose) {
        console.log(`Running command ${command}`);
    }

    execSync(command, { stdio: "inherit" });
})().catch(err => {
    if (yargsv.verbose) {
        const maskedError = err.toString().replace(/(AWS_\w+?=)(\S+)/g, '$1XXXXXXXXXXXXXXXXXXXX');
        console.log("Caught runtime exception:", maskedError);
    }

    process.exit(1);
});
