function isRoleArn (roleArn) {
<<<<<<< HEAD
    return [
        /^arn:aws:iam/,
        /^arn:aws-cn:iam/,
        /^arn:aws-us-gov:iam/
    ].some(regex => regex.test(roleArn));
=======
    return /^arn:aws:iam/.test(roleArn);
>>>>>>> origin/master
}

module.exports = {
    isRoleArn
};
