const fs = require('fs');

//https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_revoke-sessions.html
function cleanAwsCredentialsCache({ isWindows }) {
    if (!isWindows && fs.existsSync('~/.aws/cli/cache')) {
        fs.rmdirSync('~/.aws/cli/cache', { recursive: true });
    }
    if (isWindows && fs.existsSync('%UserProfile%\\.aws\\cli\\cache')) {
        fs.rmdirSync('%UserProfile%\\.aws\\cli\\cache', { recursive: true });
    }
}

module.exports = {
    cleanAwsCredentialsCache
};
