const { loadSharedConfigFiles } = require('@aws-sdk/shared-ini-file-loader');

async function loadProfilesFromConfig({ profile } = {}) {
    try {
        const {
            configFile: profiles
        } = await loadSharedConfigFiles({ profile });

        return profiles;
    }
    catch (__error) {
        return {};
    }
}

module.exports = {
    loadProfilesFromConfig
};