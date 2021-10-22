function isRoleArn (roleArn) {
    return [
        /^arn:aws:iam/,
        /^arn:aws-cn:iam/,
        /^arn:aws-us-gov:iam/
    ].some(regex => regex.test(roleArn));
}

module.exports = {
    isRoleArn
};
