const AWS = require('aws-sdk');
const { objectEntriesFilter } = require('../object-entries-filter');

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

    return objectEntriesFilter({
        duration,
        externalId,
        mfaTokenArn,
        roleArn,
        sessionName
    }, {});
}

module.exports = {
    getProfileOptionsValues
};
