const { isRoleArn } = require('../is-role-arn');

// TODO: Using boolean is weird for these
const NO_EXTERNAL_ID = false;
const NO_MFA_TOKEN = false;
const NO_MFA_TOKEN_ARN = false;
const NO_ROLE_ARN = '';

const DEFAULT_DURATION = 900;
const DEFAULT_EXTERNAL_ID = NO_EXTERNAL_ID;
const DEFAULT_MFA_TOKEN = NO_MFA_TOKEN;
const DEFAULT_MFA_TOKEN_ARN = NO_MFA_TOKEN_ARN;
const DEFAULT_PROFILE = '';
const DEFAULT_ROLE_ARN = NO_ROLE_ARN;
const DEFAULT_SESSION_NAME = 'RoleSession';
const DEFAULT_VERBOSE_VALUE = false;

class Options {
    constructor ({
        command,
        duration = DEFAULT_DURATION,
        externalId = DEFAULT_EXTERNAL_ID,
        mfaToken = DEFAULT_MFA_TOKEN,
        mfaTokenArn = DEFAULT_MFA_TOKEN_ARN,
        profile = DEFAULT_PROFILE,
        roleArn = DEFAULT_ROLE_ARN,
        sessionName = DEFAULT_SESSION_NAME,
        verbose = DEFAULT_VERBOSE_VALUE
    }) {
        // TODO: Type and range checks

        if (roleArn !== NO_ROLE_ARN && !isRoleArn(roleArn)) {
            // TODO: Convert to thrown error
            console.log(`Invalid role arn provided. Provided value: ${roleArn}`);
            process.exit(1);
        }

        if (!roleArn && !profile) {
            console.log('Either a role arn or a profile must be specified');
            process.exit(1);
        }

        if (roleArn && profile) {
            console.log('Only one of a role arn or a profile can be specified');
            process.exit(1);
        }

        this.command = command;
        this.duration = duration;
        this.externalId = externalId;
        this.mfaToken = mfaToken;
        this.mfaTokenArn = mfaTokenArn;
        this.profile = profile;
        this.roleArn = roleArn;
        this.sessionName = sessionName;
        this.verbose = verbose;
    }
}

module.exports = {
    DEFAULT_DURATION,
    DEFAULT_EXTERNAL_ID,
    DEFAULT_MFA_TOKEN,
    DEFAULT_MFA_TOKEN_ARN,
    DEFAULT_PROFILE,
    DEFAULT_ROLE_ARN,
    DEFAULT_SESSION_NAME,
    DEFAULT_VERBOSE_VALUE,

    NO_EXTERNAL_ID,
    NO_MFA_TOKEN,
    NO_MFA_TOKEN_ARN,
    NO_ROLE_ARN,

    Options
};
