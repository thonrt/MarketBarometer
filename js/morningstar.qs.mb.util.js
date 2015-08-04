function QS_RegisterNameSpaces(nameSpaces) {
    var parts = nameSpaces.split(".");
    var root = window;
    for (var i = 0, len = parts.length; i < len; i++) {
        root[parts[i]] = new Object();
        root = root[parts[i]];
    }
}