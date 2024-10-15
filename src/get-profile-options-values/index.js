const { loadProfilesFromConfig } = require('../load-profiles-from-config');
const { removeObjectEntries } = require('../remove-object-entries');

const UNDEFINED_PROFILE_OPTIONS = {};

async function getProfileOptionsValues (profile) {
    try {
        const profiles = await loadProfilesFromConfig({ profile });

        const profileOptions = {
            duration: profiles[profile].duration_seconds,
            externalId: profiles[profile].external_id,
            sessionName: profiles[profile].role_session_name,
            mfaTokenArn: profiles[profile].mfa_serial
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
