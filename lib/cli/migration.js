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
exports.createMigrationProgram = void 0;
var chalk = require("chalk");
var config_1 = require("../core/config");
var id_1 = require("../core/id");
var log_1 = require("../core/log");
var migrations_1 = require("../migrations");
var generate_1 = require("../migrations/generate");
var revert_1 = require("../migrations/revert");
var run_1 = require("../migrations/run");
var options_1 = require("./options");
var createMigrationProgram = function (program) {
    (0, options_1.addOptions)(program.command('migration:generate'))
        .argument('<name>', 'The name of the new migration')
        .option('-d, --dryrun', 'Dry run')
        .action(function (name, params) { return __awaiter(void 0, void 0, void 0, function () {
        var options, migration, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    (0, log_1.broadcast)(chalk.reset('Generating migration from changes...'));
                    return [4 /*yield*/, (0, config_1.parseConfig)(params)];
                case 1:
                    options = _a.sent();
                    return [4 /*yield*/, (0, generate_1.generateMigration)((0, id_1.formatId)(name), name, options)];
                case 2:
                    migration = _a.sent();
                    (0, log_1.broadcast)(chalk.bold('Migration generated 🎉'));
                    // Migration only gets returned for dry runs
                    if (migration) {
                        (0, log_1.broadcast)('');
                        (0, log_1.broadcast)(migration);
                    }
                    else {
                        (0, log_1.broadcast)(chalk.reset('Run'), chalk.cyan('migration:run'), chalk.reset('to apply all the changes to the database'));
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    // todo: handle config errors
                    if (error_1.message === 'NO_CHANGES') {
                        (0, log_1.broadcast)(chalk.cyan('No changes found in schema, skipping...'));
                    }
                    else if (error_1.message.startsWith('Duplicate types')) {
                        (0, log_1.broadcast)(chalk.red('[ERROR]'), chalk.reset(error_1.message));
                    }
                    else
                        (0, log_1.broadcast)(error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    (0, options_1.addOptions)(program.command('migration:create'))
        .description('Create empty migration')
        .argument('<name>', 'The name of the new migration')
        .action(function (name, params) { return __awaiter(void 0, void 0, void 0, function () {
        var options, path, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, config_1.parseConfig)(params)];
                case 1:
                    options = _a.sent();
                    return [4 /*yield*/, (0, migrations_1.createEmptyMigration)((0, id_1.formatId)(name), name, options)];
                case 2:
                    path = _a.sent();
                    (0, log_1.broadcast)(chalk.bold('Migration created 🥳'));
                    (0, log_1.broadcast)(chalk.reset('Saved at'), chalk.cyan(path));
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    if (error_2.message === 'EXISTS') {
                        (0, log_1.broadcast)(chalk.red('[ERROR]'), chalk.reset('A migration already exists with the same name.'));
                    }
                    else
                        (0, log_1.broadcast)(chalk.red('[ERROR]'), chalk.reset(error_2));
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    (0, options_1.addOptions)(program.command('migration:run'))
        .description('Run all available migrations')
        .option('--verbose')
        .action(function (params) { return __awaiter(void 0, void 0, void 0, function () {
        var options, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, config_1.parseConfig)(params)];
                case 1:
                    options = _a.sent();
                    return [4 /*yield*/, (0, run_1.runMutations)(options)];
                case 2:
                    _a.sent();
                    (0, log_1.broadcast)(chalk.bold('All new migrations have been successfully applied 🎉'));
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    if (error_3.message === 'NO_NEW_MIGRATIONS') {
                        (0, log_1.broadcast)(chalk.reset('No new migration found, skipping...'));
                    }
                    else
                        (0, log_1.broadcast)(chalk.red('[ERROR]'), chalk.reset(error_3));
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    (0, options_1.addOptions)(program.command('migration:revert'))
        .description('Revert database to a specific migration')
        .option('-m, --migration <migration  id>', 'ID of the migration the database will be reverted to.')
        .action(function (params) { return __awaiter(void 0, void 0, void 0, function () {
        var options, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, config_1.parseConfig)(params)];
                case 1:
                    options = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, (0, revert_1.revertMigrations)(options)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    error_4 = _a.sent();
                    (0, log_1.broadcast)(error_4);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); });
};
exports.createMigrationProgram = createMigrationProgram;
