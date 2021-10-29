const AWS = require('aws-sdk');
const { getProfileOptionsValues } = require('./index');

describe('Getting profile options values', () => {
    let profile;

    beforeEach(() => {
        profile = 'TestProfile';

        spyOn(AWS.util, 'getProfilesFromSharedConfig').and.returnValue({
            [profile]: {}
        });
    });

    it('should get profile from shared config with the default iniLoader', () => {
        getProfileOptionsValues(profile);

        expect(AWS.util.getProfilesFromSharedConfig).toHaveBeenCalledWith(AWS.util.iniLoader);
    });

    it('should read duration from the named profile', () => {
        const duration = 'LONGER!!';

        AWS.util.getProfilesFromSharedConfig.and.returnValue({
            [profile]: {
                // eslint-disable-next-line camelcase
                duration_seconds: duration
            }
        });

        const result = getProfileOptionsValues(profile);

        expect(result).toEqual({
            duration
        });
    });

    it('should read externalId from the named profile', () => {
        const externalId = 'Id, BUT on the outside!';

        AWS.util.getProfilesFromSharedConfig.and.returnValue({
            [profile]: {
                // eslint-disable-next-line camelcase
                external_id: externalId
            }
        });

        const result = getProfileOptionsValues(profile);

        expect(result).toEqual({
            externalId
        });
    });

    it('should read roleArn from shared ini file credentials for the profile', () => {
        const roleArn = 'arn:yums:dinner::roll';

        spyOn(AWS, 'SharedIniFileCredentials').and.returnValue({ roleArn });

        const result = getProfileOptionsValues(profile);

        expect(AWS.SharedIniFileCredentials).toHaveBeenCalledWith({ profile });
        expect(result).toEqual({
            roleArn
        });
    });

    it('should read sessionName from the named profile', () => {
        const sessionName = 'Yoga for beginners';

        AWS.util.getProfilesFromSharedConfig.and.returnValue({
            [profile]: {
                // eslint-disable-next-line camelcase
                role_session_name: sessionName
            }
        });

        const result = getProfileOptionsValues(profile);

        expect(result).toEqual({
            sessionName
        });
    });

    it('should read mfaTokenArn from the named profile', () => {
        const mfaTokenArn = 'Id, BUT on the outside!';

        AWS.util.getProfilesFromSharedConfig.and.returnValue({
            [profile]: {
                // eslint-disable-next-line camelcase
                mfa_serial: mfaTokenArn
            }
        });

        const result = getProfileOptionsValues(profile);

        expect(result).toEqual({
            mfaTokenArn
        });
    });

    it('should omit any missing options values from the profile', () => {
        const options = getProfileOptionsValues(profile);

        expect(options).toEqual({
        });
    });
});
