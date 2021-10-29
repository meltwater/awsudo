const AWS = require('aws-sdk');

function getProfileOptionsValues (profile) {
    const { roleArn } = new AWS.SharedIniFileCredentials({ profile });
    const profiles = AWS.util.getProfilesFromSharedConfig(AWS.util.iniLoader);

    const {
        /* eslint-disable camelcase */
        duration_seconds: duration,
        external_id: externalId,
        role_session_name: sessionName,
        mfa_serial: mfaTokenArn,
        /* eslint-enable */
    } = profiles[profile];

    return Object.fromEntries(Object.entries({
        duration,
        externalId,
        mfaTokenArn,
        roleArn,
        sessionName
        // eslint-disable-next-line no-unused-vars
    }).filter(([__, value]) => Boolean(value)));
}

module.exports = {
    getProfileOptionsValues
};
