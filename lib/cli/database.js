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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDatabasePullProgram = exports.createDatabaseProgram = void 0;
var chalk = require("chalk");
var fs_extra_1 = require("fs-extra");
var inquirer_1 = require("inquirer");
var path_1 = require("path");
var config_1 = require("../core/config");
var log_1 = require("../core/log");
var pull_1 = require("../database/pull");
var save_1 = require("../entities/save");
var initQuestions_1 = require("../misc/initQuestions");
var snapshots_1 = require("../snapshots");
var options_1 = require("./options");
var createDatabaseProgram = function (program) {
    program
        .command('init')
        .summary('Initialise a new, empty configuration')
        .action(function () { return __awaiter(void 0, void 0, void 0, function () {
        var folderContent, alreadyExists, answers_1, _a, template, use_template, generate_types, connection, answers, config;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    folderContent = (0, fs_extra_1.readdirSync)(process.cwd());
                    alreadyExists = folderContent.some(function (file) { return /.orm|ormconfig/.test(file); });
                    if (!alreadyExists) return [3 /*break*/, 2];
                    (0, log_1.broadcast)('');
                    return [4 /*yield*/, (0, inquirer_1.prompt)([
                            {
                                type: 'confirm',
                                name: 'reinitialise',
                                message: 'Existing orm configuration found, are you sure you want to reinitialize?',
                                default: false,
                            },
                        ])];
                case 1:
                    answers_1 = _b.sent();
                    if (!answers_1.reinitialise) {
                        (0, log_1.broadcast)(chalk.dim('Quitting...'));
                        (0, log_1.broadcast)('');
                        return [2 /*return*/];
                    }
                    _b.label = 2;
                case 2: return [4 /*yield*/, (0, inquirer_1.prompt)(initQuestions_1.initQuestions)];
                case 3:
                    _a = _b.sent(), template = _a.template, use_template = _a.use_template, generate_types = _a.generate_types, connection = _a.connection, answers = __rest(_a, ["template", "use_template", "generate_types", "connection"]);
                    (0, log_1.broadcast)('');
                    (0, log_1.broadcast)(chalk.reset('Initialising project with template:'), chalk.bold("'".concat(template || 'default', "'")));
                    config = __assign({ driver: 'postgres' }, answers);
                    return [4 /*yield*/, (0, config_1.saveConfig)(config)];
                case 4:
                    _b.sent();
                    (0, log_1.broadcast)('');
                    (0, log_1.broadcast)(chalk.reset('Saved orm config at'), chalk.green((0, path_1.join)(process.cwd(), '.ormconfig.ts')));
                    (0, log_1.broadcast)('');
                    (0, log_1.broadcast)(chalk.bold('Successfully initialised orm project. 🎉'));
                    (0, log_1.broadcast)('');
                    (0, log_1.broadcast)(chalk.dim('Next steps:'));
                    (0, log_1.broadcast)(chalk.reset('1) Create your first entity by running:'), chalk.cyan('entity:create <name of the entity>'));
                    (0, log_1.broadcast)(chalk.reset('2) Generate the first migration:'), chalk.cyan('migrations:generate <migration>'));
                    (0, log_1.broadcast)(chalk.reset('3) Execute your new migration:'), chalk.cyan('migrations:run'));
                    (0, log_1.broadcast)('');
                    (0, log_1.broadcast)(chalk.reset('Or pull the current schema of the database by running:'), chalk.cyan('database:pull'));
                    (0, log_1.broadcast)('');
                    return [2 /*return*/];
            }
        });
    }); });
};
exports.createDatabaseProgram = createDatabaseProgram;
var createDatabasePullProgram = function (program) {
    (0, options_1.addOptions)(program.command('database:pull').summary('Pull database schema from connection'))
        .option('-d, --dryrun', 'Dry run')
        .action(function (params) { return __awaiter(void 0, void 0, void 0, function () {
        var options, entities;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, log_1.broadcast)(chalk.reset('Pulling database schema from connection...'));
                    return [4 /*yield*/, (0, config_1.parseConfig)(params)];
                case 1:
                    options = _a.sent();
                    return [4 /*yield*/, (0, pull_1.pullSchema)(options)];
                case 2:
                    entities = _a.sent();
                    if (!options.dryrun) return [3 /*break*/, 3];
                    (0, log_1.broadcast)(JSON.stringify(entities, null, 2));
                    return [3 /*break*/, 6];
                case 3: return [4 /*yield*/, (0, save_1.saveEntities)(entities, options.entitiesDirectory)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, (0, snapshots_1.saveSnapshot)(options.snapshotsDirectory, 'init', generateSnapshots(entities))];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6:
                    (0, log_1.broadcast)('');
                    (0, log_1.broadcast)(chalk.bold('Successfully pulled database schema. 🎉'));
                    return [2 /*return*/];
            }
        });
    }); });
};
exports.createDatabasePullProgram = createDatabasePullProgram;
var generateSnapshots = function (entities) {
    return Object.values(entities).reduce(function (acc, entity) {
        var _a;
        return (__assign(__assign({}, acc), (_a = {}, _a[entity.name] = entity, _a)));
    }, {});
};
