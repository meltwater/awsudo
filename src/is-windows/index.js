function isWindows() {
    // Based on current values: https://nodejs.org/api/process.html#process_process_platform
    return process.platform === 'win32';
}

module.exports = {
    isWindows
};
