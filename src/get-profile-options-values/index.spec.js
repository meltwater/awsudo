const LoadProfilesFromConfigModule = require('../load-profiles-from-config');

describe('Getting profile options values', () => {
    let profile;
    let getProfileOptionsValues;

    beforeAll(() => {
        profile = 'TestProfile';

        spyOn(LoadProfilesFromConfigModule, 'loadProfilesFromConfig').and.returnValue({
            [profile]: {}
        });

        getProfileOptionsValues = require('./index').getProfileOptionsValues;
    });

    afterEach(() => {
        LoadProfilesFromConfigModule.loadProfilesFromConfig.and.returnValue({
            [profile]: {}
        });
    });

    it('should get profile from shared config with the default iniLoader', async () => {
        await getProfileOptionsValues(profile);

        expect(LoadProfilesFromConfigModule.loadProfilesFromConfig).toHaveBeenCalledWith(jasmine.objectContaining({
            profile
        }));
    });

    it('should read duration from the named profile', async () => {
        const duration = 'LONGER!!';

        LoadProfilesFromConfigModule.loadProfilesFromConfig.and.returnValue({
            [profile]: {
                duration_seconds: duration
            }
        });

        const result = await getProfileOptionsValues(profile);

        expect(result).toEqual({
            duration
        });
    });

    it('should read externalId from the named profile', async () => {
        const externalId = 'Id, BUT on the outside!';

        LoadProfilesFromConfigModule.loadProfilesFromConfig.and.returnValue({
            [profile]: {
                external_id: externalId
            }
        });

        const result = await getProfileOptionsValues(profile);

        expect(result).toEqual({
            externalId
        });
    });

    it('should read sessionName from the named profile', async () => {
        const sessionName = 'Yoga for beginners';

        LoadProfilesFromConfigModule.loadProfilesFromConfig.and.returnValue({
            [profile]: {
                role_session_name: sessionName
            }
        });

        const result = await getProfileOptionsValues(profile);

        expect(result).toEqual({
            sessionName
        });
    });

    it('should read mfaTokenArn from the named profile', async () => {
        const mfaTokenArn = 'Id, BUT on the outside!';

        LoadProfilesFromConfigModule.loadProfilesFromConfig.and.returnValue({
            [profile]: {
                mfa_serial: mfaTokenArn
            }
        });

        const result = await getProfileOptionsValues(profile);

        expect(result).toEqual({
            mfaTokenArn
        });
    });

    it('should omit any missing options values from the profile', async () => {
        const options = await getProfileOptionsValues(profile);

        expect(options).toEqual({
        });
    });

    it('should return an empty option set if no profiles are available', async () => {
        LoadProfilesFromConfigModule.loadProfilesFromConfig.and.throwError();

        const result = await getProfileOptionsValues();

        expect(result).toEqual({});
    });
});
