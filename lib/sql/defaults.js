"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customResolver = exports.getDefault = void 0;
var column_1 = require("./column");
/**
 * Generate the default value of the column, based on config
 * @param column sql compatible default
 * @returns
 */
var getDefault = function (table, column) { return __awaiter(void 0, void 0, void 0, function () {
    var value, _a, type, pgType, custom;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (column.kind === 'COMPUTED')
                    return [2 /*return*/, null];
                if (column.kind === 'RESOLVED')
                    return [2 /*return*/, null];
                if (column.type === 'uuid' && column.generated)
                    return [2 /*return*/, "uuid_generate_v4()"];
                if (!(typeof column.default === 'function')) return [3 /*break*/, 2];
                return [4 /*yield*/, column.default()];
            case 1:
                _a = _b.sent();
                return [3 /*break*/, 3];
            case 2:
                _a = column.default;
                _b.label = 3;
            case 3:
                value = _a;
                type = typeof value;
                pgType = (0, column_1.getTypeForColumn)(table, column.name, column);
                custom = (0, exports.customResolver)(String(value));
                if (custom)
                    return [2 /*return*/, custom];
                if (value instanceof Date)
                    return [2 /*return*/, "'".concat(value.toISOString(), "'")];
                if (type === 'string')
                    return [2 /*return*/, "'".concat(String(value).replace(/'/g, ''), "'::").concat(pgType)];
                if (type === 'number')
                    return [2 /*return*/, "".concat(Number(value), "::").concat(pgType)];
                if (type === 'boolean') {
                    return [2 /*return*/, "".concat(String(Boolean(value)).toUpperCase(), "::").concat(pgType)];
                }
                return [2 /*return*/, null];
        }
    });
}); };
exports.getDefault = getDefault;
/**
 * Generate resolvers for custom default types
 * @param value input value
 * @returns custom value or null
 */
var customResolver = function (value) {
    if (value === 'CURRENT_TIMESTAMP')
        return 'CURRENT_TIMESTAMP';
    if (['now', 'NOW()'].includes(value))
        return 'NOW()';
    if (['today'].includes(value))
        return "CURRENT_DATE";
    if (['tomorrow'].includes(value))
        return "CURRENT_DATE + INTERVAL '1 day'";
    if (['yesterday'].includes(value))
        return "CURRENT_DATE + INTERVAL '1 day'";
    return null;
};
exports.customResolver = customResolver;
