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
exports.createChangesProgram = void 0;
var chalk = require("chalk");
var config_1 = require("../core/config");
var log_1 = require("../core/log");
var load_1 = require("../entities/load");
var changes_1 = require("../migrations/changes");
var snapshots_1 = require("../snapshots");
var sql_1 = require("../sql");
var options_1 = require("./options");
/**
 * Create PostgresORM banner command
 * @param program commander program
 */
var createChangesProgram = function (program) {
    (0, options_1.addOptions)(program.command('show'))
        .summary('Show changes in entity definitions')
        .action(function (params) { return __awaiter(void 0, void 0, void 0, function () {
        var options, entitiesDirectory, snapshotsDirectory, _a, entities, snapshot, tables, changes, queries;
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        return __generator(this, function (_o) {
            switch (_o.label) {
                case 0: return [4 /*yield*/, (0, config_1.parseConfig)(params)];
                case 1:
                    options = _o.sent();
                    entitiesDirectory = options.entitiesDirectory, snapshotsDirectory = options.snapshotsDirectory;
                    (0, log_1.debug)(chalk.dim('Loading entities and latest snapshot...'));
                    return [4 /*yield*/, Promise.all([
                            (0, load_1.loadEntities)(entitiesDirectory),
                            (0, snapshots_1.loadLastSnapshot)(snapshotsDirectory),
                        ])];
                case 2:
                    _a = _o.sent(), entities = _a[0], snapshot = _a[1];
                    (0, log_1.debug)(chalk.dim('Generating tables...'));
                    tables = (0, load_1.getEntities)(entities);
                    (0, log_1.debug)(chalk.dim('Generating changes...'));
                    changes = (0, changes_1.getChangesBetweenMigrations)((snapshot === null || snapshot === void 0 ? void 0 : snapshot.tables) || {}, tables);
                    (0, log_1.debug)(chalk.dim(JSON.stringify(changes, null, 2)));
                    (0, log_1.debug)('');
                    return [4 /*yield*/, (0, sql_1.generateQueries)(changes, tables, snapshot === null || snapshot === void 0 ? void 0 : snapshot.tables)];
                case 3:
                    queries = _o.sent();
                    if (!((_b = queries === null || queries === void 0 ? void 0 : queries.up) === null || _b === void 0 ? void 0 : _b.length))
                        return [2 /*return*/, console.log(chalk.bold('No changes found in schema.'))];
                    console.log(chalk.reset('Changes found in database schema:'));
                    console.log('');
                    changes.deleted.forEach(function (table) {
                        console.log(chalk.red("- Dropped \"".concat(table, "\"")));
                        console.log('');
                    });
                    changes.created.forEach(function (table) {
                        console.log(chalk.green("+ Created \"".concat(table, "\"")));
                        console.log('');
                    });
                    changes.updated.forEach(function (change) {
                        console.log(chalk.blue("~ Updated \"".concat(change.key, "\"")));
                        if (change.key === 'VIEW') {
                        }
                        else if (change.key === 'FUNCTION') {
                        }
                        else if (change.kind === 'TABLE') {
                            // console.log(JSON.stringify(change, null, 2));
                            var changes_2 = change.changes;
                            changes_2.dropped.forEach(function (col) {
                                console.log(chalk.dim("-   Dropped column \"".concat(col, "\"")));
                            });
                            Object.keys(changes_2.added).forEach(function (col) {
                                console.log(chalk.dim("+   Added column \"".concat(col, "\"")));
                            });
                            Object.entries(changes_2.changes).forEach(function (_a) {
                                var col = _a[0], changes = _a[1];
                                console.log(chalk.dim("~   Update column \"".concat(col, "\":")));
                                changes.forEach(function (change) {
                                    console.log(chalk.dim("       Set \"".concat(change.key, "\": ").concat(formatChange(change.from), " -> ").concat(formatChange(change.to))));
                                });
                                // changes.forEach(change => {
                                //   change.
                                // })
                            });
                            changes_2.indices.dropped.forEach(function (index) {
                                console.log(chalk.red("-   Index dropped: \"".concat(index.name, "\"")));
                            });
                            changes_2.indices.created.forEach(function (index) {
                                console.log(chalk.green("+   Index created: \"".concat(index.name, "\"")));
                            });
                            changes_2.foreign.dropped.forEach(function (foreign) {
                                console.log(chalk.red("-   Foreign key dropped: \"".concat(foreign.name, "\"")));
                            });
                            changes_2.foreign.added.forEach(function (foreign) {
                                console.log(chalk.green("+   Foreign key created: \"".concat(foreign.name, "\"")));
                            });
                            changes_2.indices.updated.forEach(function (index) {
                                console.log(chalk.blue("~   Index updated: \"".concat(index.from.name, "\"")));
                            });
                            // if (changes.triggers) {
                            //   if (changes.triggers.change === 'CREATE') console.log(chalk.green(`+   Trigger function added to table`));
                            //   else if (changes.triggers.change === 'UPDATE') console.log(chalk.blue(`~   Trigger function updated`));
                            //   else console.log(chalk.red(`-   Trigger function dropped`));
                            //   if (changes.triggers.change !== 'DELETE' && changes.triggers.beforeUpdate) {
                            //     console.log(
                            //       chalk.blue(`~     Trigger procedure udpated: "beforeUpdate":`),
                            //       chalk.reset(
                            //         `(${formatChange(changes.triggers.beforeUpdate.from?.procedure)} -> ${formatChange(
                            //           changes.triggers.beforeUpdate.to?.procedure,
                            //         )})`,
                            //       ),
                            //     );
                            //   }
                            //   if (changes.triggers.change !== 'DELETE') {
                            //     changes.triggers.created.forEach((trigger) => {
                            //       console.log(
                            //         chalk.green(`+     Trigger added to "${trigger.key}":`),
                            //         chalk.reset(`setting to: "${trigger.set}"`),
                            //       );
                            //     });
                            //     changes.triggers.deleted.forEach((trigger) => {
                            //       console.log(chalk.red(`+     Trigger dropped from "${trigger.key}")`));
                            //     });
                            //     changes.triggers.updated.forEach((trigger) => {
                            //       console.log(
                            //         chalk.blue(`~     Trigger updated: "${trigger.key}":`),
                            //         chalk.reset(`("${trigger.from.set}" -> "${trigger.to.set}")`),
                            //       );
                            //     });
                            //   }
                            // }
                            // console.log(changes);
                        }
                        console.log('');
                    });
                    (_d = (_c = changes.extensions) === null || _c === void 0 ? void 0 : _c.added) === null || _d === void 0 ? void 0 : _d.forEach(function (ext) {
                        console.log(chalk.green("+ Extension added: \"".concat(ext, "\"")));
                    });
                    (_f = (_e = changes.extensions) === null || _e === void 0 ? void 0 : _e.dropped) === null || _f === void 0 ? void 0 : _f.forEach(function (ext) {
                        console.log(chalk.red("- Extension removed: \"".concat(ext, "\"")));
                    });
                    (_h = (_g = changes.types) === null || _g === void 0 ? void 0 : _g.created) === null || _h === void 0 ? void 0 : _h.forEach(function (type) {
                        console.log(chalk.green("+ Custom type created: \"".concat(type.name, "\"")));
                    });
                    (_k = (_j = changes.types) === null || _j === void 0 ? void 0 : _j.deleted) === null || _k === void 0 ? void 0 : _k.forEach(function (type) {
                        console.log(chalk.red("- Custom type removed: \"".concat(type.name, "\"")));
                    });
                    (_m = (_l = changes.types) === null || _l === void 0 ? void 0 : _l.updated) === null || _m === void 0 ? void 0 : _m.forEach(function (type) {
                        console.log(chalk.blue("~ Custom type updated: \"".concat(type.name, "\"")));
                    });
                    return [2 /*return*/];
            }
        });
    }); });
};
exports.createChangesProgram = createChangesProgram;
var formatChange = function (change) {
    if (!change)
        return 'UNSET';
    if (typeof change === 'object')
        return JSON.stringify(change);
    if (typeof change === 'string')
        return "\"".concat(change, "\"");
    return "".concat(change);
};
