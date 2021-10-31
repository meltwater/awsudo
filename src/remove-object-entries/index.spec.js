const { removeObjectEntries } = require('./index');

describe('Removing object entries', () => {
    it('should remove matching entries from the object', () => {
        const entries = { discardThisProperty: true };

        const result = removeObjectEntries(
            { other: 'properties', ...entries },
            entries
        );

        expect(result).not.toEqual(jasmine.objectContaining(entries));
    });

    it('should not remove non-matching entries from the object', () => {
        const baseObject = { keepThisProperty: true };

        const result = removeObjectEntries(
            baseObject,
            { missing: 'properties' }
        );

        expect(result).toEqual(baseObject);
    });

    it('should remove matching undefined values', () => {
        const undefinedProperty = 'divideByZero';

        const result = removeObjectEntries(
            { [undefinedProperty]: undefined },
            {}
        );

        expect(result.hasOwnProperty(undefinedProperty)).toBeFalse();
    });

    it('should not remove non-matching undefined values', () => {
        const undefinedProperty = 'divideByZero';

        const result = removeObjectEntries(
            { [undefinedProperty]: undefined },
            { [undefinedProperty]: 'not really' }
        );

        expect(result.hasOwnProperty(undefinedProperty)).toBeTrue();
    });
});
