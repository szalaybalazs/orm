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
exports.generateQueries = void 0;
var loop_1 = require("../core/loop");
var extension_1 = require("./extension");
var function_1 = require("./function");
var table_1 = require("./table");
var types_1 = require("./types");
var view_1 = require("./view");
var points = {
    FUNCTION: 0,
    TABLE: 1,
    VIEW: 2,
};
var getPoints = function (entity) { return points[entity.type || 'TABLE']; };
// todo: creation order: extensions -> function -> table -> indices -> foreign keys -> trigger & views
// todo: drop order: views -> trigger -> indices -> foreign keys -> table & function -> extensions
/**
 * Generate schema changing SQL queries
 * @param changes changes between the two schemas
 * @param state current table definition
 * @param snapshot previous definitions
 * @returns schema changes
 */
var generateQueries = function (changes, state, snapshot) { return __awaiter(void 0, void 0, void 0, function () {
    var up, down, droppedEntities, droppedPromise, createdEntities, createdPromise, updatedPromise, typeChanges;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                up = [];
                down = [];
                droppedEntities = changes.deleted.sort(function (a, b) {
                    return getPoints(snapshot[b]) - getPoints(snapshot[a]);
                });
                droppedPromise = (0, loop_1.loopOver)(droppedEntities, function (key) { return __awaiter(void 0, void 0, void 0, function () {
                    var entity, _a, _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                entity = snapshot[key];
                                // Drop table from current schema
                                if (entity.type === 'VIEW')
                                    up.push((0, view_1.dropView)(entity));
                                else if (entity.type === 'FUNCTION')
                                    up.push((0, function_1.dropFunction)(entity));
                                else
                                    up.push((0, table_1.dropTable)(key));
                                if (!(entity.type === 'VIEW')) return [3 /*break*/, 1];
                                down.unshift((0, view_1.createView)(entity));
                                return [3 /*break*/, 4];
                            case 1:
                                if (!(entity.type === 'FUNCTION')) return [3 /*break*/, 2];
                                down.unshift((0, function_1.createFunction)(entity));
                                return [3 /*break*/, 4];
                            case 2:
                                _b = (_a = down.unshift).apply;
                                _c = [down];
                                return [4 /*yield*/, (0, table_1.createTable)(entity)];
                            case 3:
                                _b.apply(_a, _c.concat([(_d.sent())]));
                                _d.label = 4;
                            case 4: return [2 /*return*/];
                        }
                    });
                }); });
                createdEntities = changes.created.sort(function (a, b) {
                    return getPoints(state[a]) - getPoints(state[b]);
                });
                createdPromise = (0, loop_1.loopOver)(createdEntities, function (key) { return __awaiter(void 0, void 0, void 0, function () {
                    var entity, _a, _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                entity = state[key];
                                if (!(entity.type === 'VIEW')) return [3 /*break*/, 1];
                                up.push((0, view_1.createView)(entity));
                                return [3 /*break*/, 4];
                            case 1:
                                if (!(entity.type === 'FUNCTION')) return [3 /*break*/, 2];
                                up.push((0, function_1.createFunction)(entity));
                                return [3 /*break*/, 4];
                            case 2:
                                _b = (_a = up.push).apply;
                                _c = [up];
                                return [4 /*yield*/, (0, table_1.createTable)(entity)];
                            case 3:
                                _b.apply(_a, _c.concat([(_d.sent())]));
                                _d.label = 4;
                            case 4:
                                // Destroying table when reverted
                                if (entity.type === 'VIEW')
                                    down.unshift((0, view_1.dropView)(entity));
                                else if (entity.type === 'FUNCTION')
                                    down.unshift((0, function_1.dropFunction)(entity));
                                else
                                    down.unshift((0, table_1.dropTable)(key));
                                return [2 /*return*/];
                        }
                    });
                }); });
                updatedPromise = (0, loop_1.loopOver)(changes.updated, function (change) { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, transactionsUp, transactionsDown;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                if (!(change.kind === 'VIEW')) return [3 /*break*/, 1];
                                if (change.changes.replace.up)
                                    up.push((0, view_1.dropView)(snapshot[change.key]));
                                if (change.changes.replace.down)
                                    down.unshift((0, view_1.dropView)(state[change.key]));
                                up.push((0, view_1.createView)(state[change.key]));
                                down.unshift((0, view_1.createView)(snapshot[change.key]));
                                return [3 /*break*/, 4];
                            case 1:
                                if (!(change.kind === 'FUNCTION')) return [3 /*break*/, 2];
                                return [3 /*break*/, 4];
                            case 2: return [4 /*yield*/, (0, table_1.updateTable)(change.changes, state[change.key], snapshot[change.key])];
                            case 3:
                                _a = _b.sent(), transactionsUp = _a[0], transactionsDown = _a[1];
                                // Commit changes to tables
                                if (transactionsUp)
                                    up.push.apply(up, transactionsUp);
                                // Revert changes
                                if (transactionsDown)
                                    down.unshift.apply(down, transactionsDown);
                                _b.label = 4;
                            case 4: return [2 /*return*/];
                        }
                    });
                }); });
                return [4 /*yield*/, Promise.all([droppedPromise, createdPromise, updatedPromise])];
            case 1:
                _a.sent();
                // Handle Extensions
                if (changes.extensions) {
                    changes.extensions.added.forEach(function (extension) {
                        up.unshift((0, extension_1.createExtension)(extension));
                        down.push((0, extension_1.dropExtension)(extension));
                    });
                    changes.extensions.dropped.forEach(function (extension) {
                        up.unshift((0, extension_1.dropExtension)(extension));
                        down.push((0, extension_1.createExtension)(extension));
                    });
                }
                if (!changes.types) return [3 /*break*/, 3];
                changes.types.deleted.forEach(function (type) {
                    up.unshift((0, types_1.dropType)(type.name));
                    var newType = (0, types_1.createType)(type.name, type.values);
                    if (!down.includes(newType))
                        down.push(newType);
                });
                changes.types.created.forEach(function (type) {
                    var newType = (0, types_1.createType)(type.name, type.values);
                    if (!up.includes(newType))
                        up.unshift(newType);
                    down.push((0, types_1.dropType)(type.name));
                });
                typeChanges = changes.types.updated.map(function (type) { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, _b, _c, _d, _e, _f;
                    return __generator(this, function (_g) {
                        switch (_g.label) {
                            case 0:
                                if (!type.removed.length) return [3 /*break*/, 2];
                                _b = (_a = up.unshift).apply;
                                _c = [up];
                                return [4 /*yield*/, (0, types_1.removeValue)(type.new, type.old.dependencies, state)];
                            case 1:
                                _b.apply(_a, _c.concat([(_g.sent())]));
                                _g.label = 2;
                            case 2:
                                type.removed.forEach(function (value) {
                                    down.push((0, types_1.addValue)(type.name, value));
                                });
                                type.added.forEach(function (value) {
                                    up.unshift((0, types_1.addValue)(type.name, value));
                                });
                                if (!type.added) return [3 /*break*/, 4];
                                _e = (_d = down.push).apply;
                                _f = [down];
                                return [4 /*yield*/, (0, types_1.removeValue)(type.old, type.new.dependencies, snapshot)];
                            case 3:
                                _e.apply(_d, _f.concat([(_g.sent())]));
                                _g.label = 4;
                            case 4: return [2 /*return*/];
                        }
                    });
                }); });
                return [4 /*yield*/, Promise.all(typeChanges)];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [2 /*return*/, { up: up, down: down }];
        }
    });
}); };
exports.generateQueries = generateQueries;
