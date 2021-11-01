const AWS = require('aws-sdk');

function getProfileList () {
    try {
        return Object.keys(AWS.util.getProfilesFromSharedConfig(AWS.util.iniLoader));
    }
    catch (error) {
        return [];
    }
}

module.exports = {
    getProfileList
};
