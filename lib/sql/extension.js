"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dropExtension = exports.createExtension = void 0;
var createExtension = function (extension) {
    var ext = getExtension(extension);
    if (!ext)
        return '';
    return "CREATE EXTENSION IF NOT EXISTS \"".concat(ext, "\"");
};
exports.createExtension = createExtension;
var dropExtension = function (extension) {
    var ext = getExtension(extension);
    if (!ext)
        return '';
    return "CREATE EXTENSION IF NOT EXISTS \"".concat(ext, "\"");
};
exports.dropExtension = dropExtension;
var getExtension = function (extension) {
    if (extension === 'uuid')
        return 'uuid-ossp';
    if (extension === 'tablefunc')
        return 'tablefunc';
    return null;
};
