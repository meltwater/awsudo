const fs = require('fs');

//https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_revoke-sessions.html
function cleanAwsCredentialsCache() {
    if (fs.existsSync('~/.aws/cli/cache')) {
        fs.rmdirSync('~/.aws/cli/cache', { recursive: true });
    }
    if (fs.existsSync('%UserProfile%\\.aws\\cli\\cache')) {
        fs.rmdirSync('%UserProfile%\\.aws\\cli\\cache', { recursive: true });
    }
}

module.exports = {
    cleanAwsCredentialsCache
};
