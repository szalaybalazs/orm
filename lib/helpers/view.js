"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getViewResolver = void 0;
var getViewResolver = function (name, resolver) {
    if (resolver === void 0) { resolver = ''; }
    var sql = typeof resolver === 'string' ? resolver : resolver(name);
    var query = sql.replace(/__NAME__/g, "\"".concat(name, "\"")).replace(/\\n/g, '\n');
    return {
        query: query,
        isRecursive: query.includes(name),
    };
};
exports.getViewResolver = getViewResolver;
