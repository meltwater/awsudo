const AWS = require('aws-sdk');
const { getProfileList } = require('./index');

describe('Getting profile list', () => {
    beforeEach(() => {
        spyOn(AWS.util, 'getProfilesFromSharedConfig').and.returnValue({});
    });

    it('should get profiles from shared config with the default iniLoader', () => {
        getProfileList();

        expect(AWS.util.getProfilesFromSharedConfig).toHaveBeenCalledWith(AWS.util.iniLoader);
    });

    it('should return profile object\'s keys', () => {
        const profiles = {
            ProfileOne: {},
            ProfileTwo: {}
        };

        AWS.util.getProfilesFromSharedConfig.and.returnValue(profiles);

        const result = getProfileList();

        expect(result).toEqual(Object.keys(profiles));
    });
});
