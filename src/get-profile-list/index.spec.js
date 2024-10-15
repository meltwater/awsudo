const LoadProfilesFromConfigModule = require('../load-profiles-from-config');

describe('Getting profile list', () => {
    let getProfileList;
    let loadProfilesFromConfigSpy;
    
    beforeAll(() => {
        loadProfilesFromConfigSpy = spyOn(LoadProfilesFromConfigModule, 'loadProfilesFromConfig');
        getProfileList = require('./index').getProfileList;
    });

    it('should get profiles from shared config with the default iniLoader', async () => {
        await getProfileList();

        expect(loadProfilesFromConfigSpy).toHaveBeenCalled();
    });

    it('should return profile object\'s keys', async () => {
        const profiles = {
            ProfileOne: {},
            ProfileTwo: {}
        };

        loadProfilesFromConfigSpy.and.returnValue(Promise.resolve(profiles));

        const result = await getProfileList();

        expect(result).toEqual(Object.keys(profiles));
    });

    it('should return an empty list if no profiles are available', async () => {
        LoadProfilesFromConfigModule.loadProfilesFromConfig.and.throwError();

        const result = await getProfileList();

        expect(result).toEqual([]);
    });
});
