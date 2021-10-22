function isRoleArn (roleArn) {
    return /^arn:aws:iam/.test(roleArn);
}

module.exports = {
    isRoleArn
};
