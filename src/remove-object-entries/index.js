/**
 * Remove the matching entries from the object.
 * An entry matches if its name and value is the same.
 *
 * @param {object} baseObject - The object to base the return value on
 * @param {object} entries - An object of entries to remove
 * @return {object} - A copy of `baseObject` stripped of properties matching `entries`
 */
function removeObjectEntries (baseObject, entries) {
    return Object.fromEntries(Object.entries(baseObject)
        .filter(([key, value]) => entries[key] !== value)
    );
}

module.exports = {
    removeObjectEntries
};
