const { cleanAwsCredentialsCache } = require('./index');
const fs = require('fs');

describe('cleanAwsCredentialsCache', () => {
    beforeEach(() => {
        spyOn(fs, 'existsSync');
        spyOn(fs, 'rmdirSync');
    });

    it('should be a function', () => {
        expect(cleanAwsCredentialsCache).toEqual(jasmine.any(Function));
    });

    describe('on windows', () => {
        beforeEach(() => {
            fs.existsSync.and.callFake(path => {
                if (path.includes('UserProfile')) {
                    return true;
                }
                return false;
            });
        });

        it('should remove aws credentials cache folder', () => {
            cleanAwsCredentialsCache({ isWindows: true });

            expect(fs.rmdirSync).toHaveBeenCalledWith('%UserProfile%\\.aws\\cli\\cache', jasmine.anything());
        });

        it('should pass option to allow folder to be emptied if it has contents', () => {
            fs.existsSync.and.callFake(path => {
                if (path.includes('UserProfile')) {
                    return true;
                }
                return false;
            });

            cleanAwsCredentialsCache({ isWindows: true });

            expect(fs.rmdirSync).toHaveBeenCalledWith(jasmine.anything(), { recursive: true });
        });
    });

    describe('on macOs/unix/linux', () => {
        beforeEach(() => {
            fs.existsSync.and.callFake(path => {
                if (path.includes('~/')) {
                    return true;
                }
                return false;
            });
        });

        it('should remove aws credentials cache folder', () => {
            cleanAwsCredentialsCache({ isWindows: false });

            expect(fs.rmdirSync).toHaveBeenCalledWith('~/.aws/cli/cache', jasmine.anything());
        });

        it('should pass option to allow folder to be emptied if it has contents', () => {
            cleanAwsCredentialsCache({ isWindows: false });

            expect(fs.rmdirSync).toHaveBeenCalledWith(jasmine.anything(), { recursive: true });
        });
    });
});
