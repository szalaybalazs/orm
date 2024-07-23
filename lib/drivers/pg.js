"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.createPostgresConnection = void 0;
var pg_1 = require("pg");
var sql_highlight_1 = require("sql-highlight");
var chalk_1 = require("../core/chalk");
var log_1 = require("../core/log");
/**
 * Create postgres connection
 * @param options postgres connection option
 * @returns query handler
 */
var createPostgresConnection = function (options) {
    try {
        var pool_1 = new pg_1.Pool(__assign(__assign({}, options), { types: undefined }));
        /**
         * Execute SQL queries
         * @param sql query to be executed
         * @param variables query variables
         * @returns
         */
        var query = function (sql, variables) {
            if (variables === void 0) { variables = []; }
            return __awaiter(void 0, void 0, void 0, function () {
                var rows, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            (0, log_1.debug)(chalk_1.chalk.dim('> Running query:'));
                            (0, log_1.debug)((0, sql_highlight_1.highlight)(sql));
                            return [4 /*yield*/, pool_1.query(sql, variables)];
                        case 1:
                            rows = (_a.sent()).rows;
                            return [2 /*return*/, rows];
                        case 2:
                            error_1 = _a.sent();
                            (0, log_1.debug)(chalk_1.chalk.dim("  > Failed to execute: ".concat(error_1.message)));
                            // debug(chalk.red('[ERROR]'), chalk.reset('Failed to execute query:'), highlight(sql));
                            // debug(chalk.yellow('> reason:'), chalk.reset(error.message));
                            throw error_1;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Close driver connection
         */
        var close_1 = function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, pool_1.end()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        return { query: query, close: close_1 };
    }
    catch (error) {
        (0, log_1.broadcast)(chalk_1.chalk.red('[ERROR]'), chalk_1.chalk.reset('Failed to connect'), error);
        throw error;
    }
};
exports.createPostgresConnection = createPostgresConnection;
