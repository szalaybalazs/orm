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
exports.generateMigration = void 0;
var chalk = require("chalk");
var inquirer_1 = require("inquirer");
var log_1 = require("../core/log");
var load_1 = require("../entities/load");
var snapshots_1 = require("../snapshots");
var sql_1 = require("../sql");
var changes_1 = require("./changes");
var filesystem_1 = require("./filesystem");
var template_1 = require("./template");
// todo: move extension creation to migration
// todo: save default value for stanpshots by running resolver functions when saving
var checkForDataLoss = function (queries) {
    return queries.some(function (query) {
        var sql = query.trim().toLowerCase();
        if (sql.startsWith('create trigger'))
            return false;
        if (sql.startsWith('create or replace function'))
            return false;
        if (sql.startsWith('drop trigger'))
            return false;
        if (sql.startsWith('drop function'))
            return false;
        return sql.includes(' drop ');
    });
};
/**
 * Generate new migration
 * @param id id of the migration
 * @param name name of the migrations
 * @param options configuration
 */
var generateMigration = function (id, name, options) { return __awaiter(void 0, void 0, void 0, function () {
    var entitiesDirectory, snapshotsDirectory, migrationDirectory, verbose, _a, entities, snapshot, tables, changes, queries, answers, migration;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                entitiesDirectory = options.entitiesDirectory, snapshotsDirectory = options.snapshotsDirectory, migrationDirectory = options.migrations, verbose = options.verbose;
                (0, log_1.debug)(chalk.dim('Loading entities and latest snapshot...'));
                return [4 /*yield*/, Promise.all([
                        (0, load_1.loadEntities)(entitiesDirectory),
                        (0, snapshots_1.loadLastSnapshot)(snapshotsDirectory),
                    ])];
            case 1:
                _a = _c.sent(), entities = _a[0], snapshot = _a[1];
                (0, log_1.debug)(chalk.dim('Generating tables...'));
                tables = (0, load_1.getEntities)(entities);
                (0, log_1.debug)(chalk.dim('Generating changes...'));
                changes = (0, changes_1.getChangesBetweenMigrations)((snapshot === null || snapshot === void 0 ? void 0 : snapshot.tables) || {}, tables);
                (0, log_1.debug)(chalk.dim('Generating queries...'));
                return [4 /*yield*/, (0, sql_1.generateQueries)(changes, tables, (_b = snapshot === null || snapshot === void 0 ? void 0 : snapshot.tables) !== null && _b !== void 0 ? _b : {})];
            case 2:
                queries = _c.sent();
                (0, log_1.debug)(chalk.dim('Checking for changes...'));
                if (queries.up.length === 0)
                    throw new Error('NO_CHANGES');
                if (!checkForDataLoss(queries.up)) return [3 /*break*/, 4];
                return [4 /*yield*/, (0, inquirer_1.prompt)([
                        {
                            type: 'confirm',
                            name: 'drop',
                            message: 'Migration may result in the loss of data, are you sure you want to continue?',
                            default: false,
                        },
                    ])];
            case 3:
                answers = _c.sent();
                if (!answers.drop)
                    return [2 /*return*/, (0, log_1.broadcast)(chalk.cyan('Skipping...'))];
                _c.label = 4;
            case 4:
                (0, log_1.debug)(chalk.dim('Generating migration...'));
                migration = (0, template_1.getMigrationTemplate)(id, name, queries.up, queries.down);
                if (options.dryrun)
                    return [2 /*return*/, migration];
                (0, log_1.debug)(chalk.dim('Saving migration and new snapshot...'));
                return [4 /*yield*/, Promise.all([(0, filesystem_1.saveMigration)(id, migration, migrationDirectory), (0, snapshots_1.saveSnapshot)(snapshotsDirectory, id, tables)])];
            case 5:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.generateMigration = generateMigration;
