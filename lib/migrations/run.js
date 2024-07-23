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
exports.executeMigrations = exports.runMutations = void 0;
var chalk = require("chalk");
var log_1 = require("../core/log");
var pg_1 = require("../drivers/pg");
var load_1 = require("../entities/load");
var typing_1 = require("../typing");
var init_1 = require("./init");
var migrations_1 = require("./migrations");
// todo: add error if there are more migration in the database than locally available
// todo: support multiple schemas
/**
 * Run all available migrations
 * @param options orm config
 */
var runMutations = function (options) { return __awaiter(void 0, void 0, void 0, function () {
    var migrationsTable, schema, _a, query, close, migrations, entities, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                migrationsTable = options.migrationsTable || '__migrations__';
                schema = options.schema || 'public';
                (0, log_1.debug)(chalk.dim("Running migrations using table: ".concat(migrationsTable, "...")));
                // Creating SQL handler
                (0, log_1.debug)(chalk.dim("Establishing connection to database..."));
                _a = (0, pg_1.createPostgresConnection)(options), query = _a.query, close = _a.close;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 8, 9, 11]);
                return [4 /*yield*/, (0, init_1.initMigrationExecution)(migrationsTable, schema, query, options)];
            case 2:
                _b.sent();
                (0, log_1.debug)(chalk.dim("Loading migrations..."));
                return [4 /*yield*/, (0, migrations_1.getAvailableMigrations)(query, options, { schema: schema, migrationsTable: migrationsTable })];
            case 3:
                migrations = _b.sent();
                if (migrations.length < 1)
                    throw new Error('NO_NEW_MIGRATIONS');
                return [4 /*yield*/, (0, exports.executeMigrations)({ migrations: migrations, query: query, schema: schema, migrationsTable: migrationsTable, options: options })];
            case 4:
                _b.sent();
                if (!options.typesDirectory) return [3 /*break*/, 7];
                return [4 /*yield*/, (0, load_1.loadEntities)(options.entitiesDirectory)];
            case 5:
                entities = _b.sent();
                return [4 /*yield*/, (0, typing_1.saveTypes)(entities, options)];
            case 6:
                _b.sent();
                _b.label = 7;
            case 7:
                (0, log_1.debug)(chalk.dim('Migrations commited...'));
                return [3 /*break*/, 11];
            case 8:
                error_1 = _b.sent();
                throw error_1;
            case 9: 
            // closing psql connection
            return [4 /*yield*/, close()];
            case 10:
                // closing psql connection
                _b.sent();
                return [7 /*endfinally*/];
            case 11: return [2 /*return*/];
        }
    });
}); };
exports.runMutations = runMutations;
var executeMigrations = function (_a) {
    var migrations = _a.migrations, schema = _a.schema, query = _a.query, migrationsTable = _a.migrationsTable, options = _a.options;
    return __awaiter(void 0, void 0, void 0, function () {
        var _i, migrations_2, migration, allQueries, queries, _b, queries_1, sql, error_2, allQueries_1, queries_3, _c, queries_2, sql, error_3;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _i = 0, migrations_2 = migrations;
                    _d.label = 1;
                case 1:
                    if (!(_i < migrations_2.length)) return [3 /*break*/, 18];
                    migration = migrations_2[_i];
                    (0, log_1.debug)(chalk.dim('> Generating propagated queries...'));
                    return [4 /*yield*/, migration.up({ schema: schema, query: query, extra: options.extraOptions })];
                case 2:
                    allQueries = _d.sent();
                    queries = Array.isArray(allQueries) ? allQueries : [allQueries];
                    _d.label = 3;
                case 3:
                    _d.trys.push([3, 9, , 17]);
                    (0, log_1.debug)(chalk.dim("> Executing migration: ".concat(migration.id, "...")));
                    _b = 0, queries_1 = queries;
                    _d.label = 4;
                case 4:
                    if (!(_b < queries_1.length)) return [3 /*break*/, 7];
                    sql = queries_1[_b];
                    return [4 /*yield*/, query(sql)];
                case 5:
                    _d.sent();
                    _d.label = 6;
                case 6:
                    _b++;
                    return [3 /*break*/, 4];
                case 7:
                    (0, log_1.debug)(chalk.dim('> Updating migrations table...'));
                    return [4 /*yield*/, query("INSERT INTO \"".concat(schema, "\".\"").concat(migrationsTable, "\" (id) VALUES ($1)"), [migration.id])];
                case 8:
                    _d.sent();
                    return [3 /*break*/, 17];
                case 9:
                    error_2 = _d.sent();
                    (0, log_1.debug)(chalk.dim('> Migration failed, reverting...'));
                    return [4 /*yield*/, migration.down({ schema: schema, query: query, extra: options.extraOptions })];
                case 10:
                    allQueries_1 = _d.sent();
                    queries_3 = Array.isArray(allQueries_1) ? allQueries_1 : [allQueries_1];
                    _c = 0, queries_2 = queries_3;
                    _d.label = 11;
                case 11:
                    if (!(_c < queries_2.length)) return [3 /*break*/, 16];
                    sql = queries_2[_c];
                    _d.label = 12;
                case 12:
                    _d.trys.push([12, 14, , 15]);
                    return [4 /*yield*/, query(sql)];
                case 13:
                    _d.sent();
                    return [3 /*break*/, 15];
                case 14:
                    error_3 = _d.sent();
                    (0, log_1.debug)(chalk.dim("Failed to revert query: ".concat(sql)));
                    return [3 /*break*/, 15];
                case 15:
                    _c++;
                    return [3 /*break*/, 11];
                case 16: 
                // todo: revert migrations on fail
                throw error_2;
                case 17:
                    _i++;
                    return [3 /*break*/, 1];
                case 18: return [2 /*return*/];
            }
        });
    });
};
exports.executeMigrations = executeMigrations;
