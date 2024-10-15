const { loadProfilesFromConfig } = require('../load-profiles-from-config');

async function getProfileList () {
    try {
        const profiles = await loadProfilesFromConfig();
        return Object.keys(profiles);
    }
    catch (__error) {
        return [];
    }
}

module.exports = {
    getProfileList
};
