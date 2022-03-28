const fs = require('fs');

//https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_revoke-sessions.html
function cleanAwsCredentialsCache() {
    // Based on current values: https://nodejs.org/api/process.html#process_process_platform
    if (process.platform !== "win32" && fs.existsSync('~/.aws/cli/cache')) {
        fs.rmdirSync('~/.aws/cli/cache', { recursive: true });
    }
    if (process.platform === "win32" && fs.existsSync('%UserProfile%\\.aws\\cli\\cache')) {
        fs.rmdirSync('%UserProfile%\\.aws\\cli\\cache', { recursive: true });
    }
}

module.exports = {
    cleanAwsCredentialsCache
};
