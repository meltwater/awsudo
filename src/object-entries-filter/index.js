function objectEntriesFilter (object, exclude) {
    return Object.fromEntries(Object.entries(object)
        .filter(([key, value]) => exclude[key] !== value)
    );
}

module.exports = {
    objectEntriesFilter
};
