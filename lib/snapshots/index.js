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
exports.saveSnapshot = exports.getSnapshotTables = exports.loadLastSnapshot = exports.loadSnapshots = void 0;
var fs_extra_1 = require("fs-extra");
var path_1 = require("path");
var chalk_1 = require("../core/chalk");
var log_1 = require("../core/log");
var naming_1 = require("../core/naming");
var view_1 = require("../helpers/view");
/**
 * Load all the snapshots from the defined directory
 * @param directory directory containing all the snapshot
 * @returns
 */
var loadSnapshots = function (directory) { return __awaiter(void 0, void 0, void 0, function () {
    var content, files, snapshots, validSnapshots, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                (0, log_1.debug)(chalk_1.chalk.dim("> Loading snapshots from: ".concat(directory)));
                return [4 /*yield*/, (0, fs_extra_1.readdir)(directory)];
            case 1:
                content = _a.sent();
                files = content.filter(function (file) { return file.endsWith('.snapshot'); });
                return [4 /*yield*/, Promise.all(files.map(function (file) { return __awaiter(void 0, void 0, void 0, function () {
                        var snapshotPath, rawSnapshot, snapshot;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    snapshotPath = (0, path_1.join)(directory, file);
                                    return [4 /*yield*/, (0, fs_extra_1.readFile)(snapshotPath, 'utf8').catch(function () { return null; })];
                                case 1:
                                    rawSnapshot = _a.sent();
                                    if (!rawSnapshot)
                                        return [2 /*return*/];
                                    snapshot = JSON.parse(rawSnapshot);
                                    return [2 /*return*/, __assign(__assign({}, snapshot), { timestamp: new Date(snapshot.timestamp), tables: Object.entries(snapshot.tables).reduce(function (acc, _a) {
                                                var _b;
                                                var key = _a[0], table = _a[1];
                                                if (table.type !== 'FUNCTION') {
                                                    table.columns = Object.entries(table.columns).reduce(function (acc, _a) {
                                                        var _b;
                                                        var key = _a[0], column = _a[1];
                                                        return __assign(__assign({}, acc), (_b = {}, _b[(0, naming_1.snakelize)(key)] = column, _b));
                                                    }, {});
                                                }
                                                return __assign(__assign({}, acc), (_b = {}, _b[key] = table, _b));
                                            }, {}) })];
                            }
                        });
                    }); }))];
            case 2:
                snapshots = _a.sent();
                validSnapshots = snapshots.filter(Boolean);
                return [2 /*return*/, validSnapshots.sort(function (a, b) { return b.timestamp.getTime() - a.timestamp.getTime(); })];
            case 3:
                error_1 = _a.sent();
                return [2 /*return*/, []];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.loadSnapshots = loadSnapshots;
var loadLastSnapshot = function (directory) { return __awaiter(void 0, void 0, void 0, function () {
    var snapshots;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                (0, log_1.debug)(chalk_1.chalk.dim("> Getting last snapshot from list"));
                return [4 /*yield*/, (0, exports.loadSnapshots)(directory)];
            case 1:
                snapshots = _a.sent();
                return [2 /*return*/, snapshots[0] || null];
        }
    });
}); };
exports.loadLastSnapshot = loadLastSnapshot;
var getSnapshotTables = function (state) {
    (0, log_1.debug)(chalk_1.chalk.dim("> Filtering out all the non-table entities"));
    var tableMap = Object.entries(state).reduce(function (acc, _a) {
        var _b;
        var key = _a[0], table = _a[1];
        if (table.type === 'VIEW')
            table.resolver = (0, view_1.getViewResolver)(table.name || key, table.resolver).query;
        return __assign(__assign({}, acc), (_b = {}, _b[key] = table, _b));
    }, {});
    return tableMap;
};
exports.getSnapshotTables = getSnapshotTables;
var saveSnapshot = function (directory, id, state) { return __awaiter(void 0, void 0, void 0, function () {
    var snapshot, rawSnapshot, fileName;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                snapshot = { id: id, timestamp: new Date(), tables: (0, exports.getSnapshotTables)(state) };
                rawSnapshot = JSON.stringify(snapshot, null, 2);
                (0, log_1.debug)(chalk_1.chalk.dim("> Generating raw snapshot data"));
                fileName = (0, path_1.join)(directory, "".concat(Math.round(Date.now() / 1000), "-").concat(id, ".snapshot"));
                if (!(0, fs_extra_1.pathExistsSync)(directory))
                    (0, fs_extra_1.mkdirsSync)(directory);
                if ((0, fs_extra_1.existsSync)(fileName))
                    throw new Error('EXISTS');
                (0, log_1.debug)(chalk_1.chalk.dim("> Saving snapshot to file"));
                return [4 /*yield*/, (0, fs_extra_1.writeFile)(fileName, rawSnapshot, { encoding: 'utf-8' })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.saveSnapshot = saveSnapshot;
