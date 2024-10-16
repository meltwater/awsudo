const AWS = require('aws-sdk');
const { removeObjectEntries } = require('../remove-object-entries');

const UNDEFINED_PROFILE_OPTIONS = {};

function getProfileOptionsValues (profile) {
    try {
        const { roleArn } = new AWS.SharedIniFileCredentials({ profile });
        const profiles = AWS.util.getProfilesFromSharedConfig(AWS.util.iniLoader);

        const profileOptions = {
            /* eslint-disable camelcase */
            duration: profiles[profile].duration_seconds,
            externalId: profiles[profile].external_id,
            sessionName: profiles[profile].role_session_name,
            mfaTokenArn: profiles[profile].mfa_serial,
            /* eslint-enable */
            roleArn
        };

        return removeObjectEntries(profileOptions, UNDEFINED_PROFILE_OPTIONS);
    }
    catch (__error) {
        return {};
    }
}

module.exports = {
    getProfileOptionsValues
};
