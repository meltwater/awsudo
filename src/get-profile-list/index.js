const AWS = require('aws-sdk');

function getProfileList () {
    return Object.keys(AWS.util.getProfilesFromSharedConfig(AWS.util.iniLoader));
}

module.exports = {
    getProfileList
};
