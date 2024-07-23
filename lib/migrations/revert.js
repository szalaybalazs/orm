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
exports.revertMigrationsById = exports.revertMigrations = void 0;
var chalk = require("chalk");
var cli_select_1 = require("cli-select");
var log_1 = require("../core/log");
var pg_1 = require("../drivers/pg");
var filesystem_1 = require("./filesystem");
var migrations_1 = require("./migrations");
var revertMigrations = function (options) { return __awaiter(void 0, void 0, void 0, function () {
    var migrationsTable, schema, _a, query, close, _b, localMigrations_1, executedMigrations, values, migration_1, index, revertedMigrations, error_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                migrationsTable = options.migrationsTable || '__migrations__';
                schema = options.schema || 'public';
                _a = (0, pg_1.createPostgresConnection)(options), query = _a.query, close = _a.close;
                _c.label = 1;
            case 1:
                _c.trys.push([1, 5, 6, 7]);
                (0, log_1.debug)(options.verbose, chalk.dim('Creating database connection...'));
                (0, log_1.debug)(options.verbose, chalk.dim('Loading local & remote migrations...'));
                return [4 /*yield*/, Promise.all([
                        (0, filesystem_1.loadMigrations)(options.migrationsDirectory),
                        (0, migrations_1.getExecutedMigrations)(migrationsTable, query, schema),
                    ])];
            case 2:
                _b = _c.sent(), localMigrations_1 = _b[0], executedMigrations = _b[1];
                values = executedMigrations.reduce(function (acc, _a) {
                    var _b;
                    var _c;
                    var id = _a.id;
                    return (__assign(__assign({}, acc), (_b = {}, _b[id] = (_c = localMigrations_1.find(function (m) { return m.id === id; })) === null || _c === void 0 ? void 0 : _c.name, _b)));
                }, {});
                (0, log_1.broadcast)(chalk.cyan.yellow('❯'), chalk.reset('Select the migration to revert to:'), chalk.dim('(The selected migtion will be the last migration to keep)'));
                return [4 /*yield*/, (0, cli_select_1.default)({
                        values: values,
                        unselected: chalk.dim('○'),
                        selected: chalk.cyan('⦿'),
                        valueRenderer: function (value, selected) {
                            if (selected) {
                                return chalk.underline(value);
                            }
                            return value;
                        },
                    })];
            case 3:
                migration_1 = _c.sent();
                if (!migration_1)
                    return [2 /*return*/];
                (0, log_1.debug)(options.verbose, chalk.dim('Reverting to selected migration...'));
                index = executedMigrations.findIndex(function (m) { return m.id === migration_1.id; });
                revertedMigrations = executedMigrations.slice(0, index);
                return [4 /*yield*/, (0, exports.revertMigrationsById)(revertedMigrations.map(function (_a) {
                        var id = _a.id;
                        return id;
                    }), migrationsTable, schema, query, options)];
            case 4:
                _c.sent();
                (0, log_1.debug)(options.verbose, chalk.dim('Revert finished...'));
                return [3 /*break*/, 7];
            case 5:
                error_1 = _c.sent();
                throw error_1;
            case 6:
                close();
                return [7 /*endfinally*/];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.revertMigrations = revertMigrations;
var revertMigrationsById = function (reverts, table, schema, query, options) { return __awaiter(void 0, void 0, void 0, function () {
    var migrations, _loop_1, _i, reverts_1, executedMigration;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, filesystem_1.loadMigrations)(options.migrationsDirectory)];
            case 1:
                migrations = _a.sent();
                (0, log_1.debug)(options.verbose, chalk.dim('Reverting migration changes...'));
                _loop_1 = function (executedMigration) {
                    var migration, queries, _b, queries_1, sql;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                migration = migrations.find(function (m) { return executedMigration === m.id; });
                                return [4 /*yield*/, migration.down({ schema: schema, query: query })];
                            case 1:
                                queries = _c.sent();
                                _b = 0, queries_1 = queries;
                                _c.label = 2;
                            case 2:
                                if (!(_b < queries_1.length)) return [3 /*break*/, 5];
                                sql = queries_1[_b];
                                return [4 /*yield*/, query(sql)];
                            case 3:
                                _c.sent();
                                _c.label = 4;
                            case 4:
                                _b++;
                                return [3 /*break*/, 2];
                            case 5: return [2 /*return*/];
                        }
                    });
                };
                _i = 0, reverts_1 = reverts;
                _a.label = 2;
            case 2:
                if (!(_i < reverts_1.length)) return [3 /*break*/, 5];
                executedMigration = reverts_1[_i];
                return [5 /*yield**/, _loop_1(executedMigration)];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5:
                (0, log_1.debug)(options.verbose, chalk.dim('Removing migrations from migration table...'));
                return [4 /*yield*/, query("DELETE FROM \"".concat(table, "\" WHERE id IN (").concat(reverts.map(function (id) { return "'".concat(id, "'"); }), ")"))];
            case 6:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.revertMigrationsById = revertMigrationsById;
