const { isRoleArn } = require('../is-role-arn');

const NO_EXTERNAL_ID = false;
const NO_MFA_TOKEN = false;
const NO_MFA_TOKEN_ARN = false;
const NO_PROFILE = '';
const NO_ROLE_ARN = '';

const DEFAULT_DURATION = 900;
const DEFAULT_EXTERNAL_ID = NO_EXTERNAL_ID;
const DEFAULT_MFA_TOKEN = NO_MFA_TOKEN;
const DEFAULT_MFA_TOKEN_ARN = NO_MFA_TOKEN_ARN;
const DEFAULT_PROFILE = NO_PROFILE;
const DEFAULT_ROLE_ARN = NO_ROLE_ARN;
const DEFAULT_SESSION_NAME = 'RoleSession';
const DEFAULT_VERBOSE_VALUE = false;

const ERROR_CONFLICTING_ROLE_ARN_AND_PROFILE = 'ERROR_CONFLICTING_ROLE_ARN_AND_PROFILE';
const ERROR_INCOMPLETE_MFA_OPTIONS = 'ERROR_INCOMPLETE_MFA_OPTIONS';
const ERROR_INVALID_ROLE_ARN = 'ERROR_INVALID_ROLE_ARN';
const ERROR_MISSING_ROLE_ARN_AND_PROFILE = 'ERROR_MISSING_ROLE_ARN_AND_PROFILE';

class OptionsError extends Error {
    constructor (errorType, errorDetail = '') {
        super('An error occurred constructing awsudo options');

        this.errorDetail = errorDetail;
        this.errorType = errorType;
    }
}

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
        if ((mfaToken === NO_MFA_TOKEN && mfaTokenArn !== NO_MFA_TOKEN_ARN) ||
            (mfaToken !== NO_MFA_TOKEN && mfaTokenArn === NO_MFA_TOKEN_ARN)) {
            const missingOption = mfaToken === NO_MFA_TOKEN ? 'mfaToken' : 'mfaTokenArn';
            throw new OptionsError(ERROR_INCOMPLETE_MFA_OPTIONS, missingOption);
        }

        if (roleArn !== NO_ROLE_ARN && !isRoleArn(roleArn)) {
            throw new OptionsError(ERROR_INVALID_ROLE_ARN);
        }

        if (!roleArn && !profile) {
            throw new OptionsError(ERROR_MISSING_ROLE_ARN_AND_PROFILE);
        }

        if (roleArn && profile) {
            throw new OptionsError(ERROR_CONFLICTING_ROLE_ARN_AND_PROFILE);
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

        Object.freeze(this);
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
};
