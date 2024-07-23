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
exports.saveConfig = exports.parseConfig = exports.loadFile = void 0;
var fs_extra_1 = require("fs-extra");
var path_1 = require("path");
var cli_1 = require("../cli");
var formatter_1 = require("../utils/formatter");
var chalk_1 = require("./chalk");
var log_1 = require("./log");
// Supported config files
var configFiles = ['ormconfig.js', 'ormconfig.ts', 'ormconfig.json'];
/**
 * Parse config path and load orm config
 * @param basePath input path - can be either a directory or a file
 * @returns orm config
 */
var loadFile = function (basePath) {
    if (basePath === void 0) { basePath = '.'; }
    return __awaiter(void 0, void 0, void 0, function () {
        var base, isExact, paths, path;
        return __generator(this, function (_a) {
            base = (0, path_1.isAbsolute)(basePath) ? basePath : (0, path_1.join)(process.cwd(), basePath);
            isExact = configFiles.some(function (f) { return base.endsWith(f); });
            if (isExact)
                return [2 /*return*/, loadConfig(base)];
            paths = configFiles.map(function (file) { return (0, path_1.join)(base, file); });
            path = paths.find(function (file) {
                return (0, fs_extra_1.existsSync)(file);
            });
            if (!path)
                throw new Error('CONFIG_MISSING');
            return [2 /*return*/, loadConfig(path)];
        });
    });
};
exports.loadFile = loadFile;
/**
 * Load config file from path
 * @param path path to the config file
 * @returns orm config
 */
var loadConfig = function (path) { return __awaiter(void 0, void 0, void 0, function () {
    var config, _config, _a, json;
    return __generator(this, function (_b) {
        var _c;
        switch (_b.label) {
            case 0:
                // throwing error if no file found
                if (!(0, fs_extra_1.existsSync)(path))
                    throw new Error('CONFIG_MISSING');
                if (!(path.endsWith('.ts') || path.endsWith('.js'))) return [3 /*break*/, 5];
                return [4 /*yield*/, (_c = path, Promise.resolve().then(function () { return require(_c); }))];
            case 1:
                config = _b.sent();
                _config = config.default || config[Object.keys(config)[0]];
                if (!(typeof _config === 'function')) return [3 /*break*/, 3];
                return [4 /*yield*/, _config()];
            case 2:
                _a = _b.sent();
                return [3 /*break*/, 4];
            case 3:
                _a = _config;
                _b.label = 4;
            case 4: return [2 /*return*/, _a];
            case 5:
                // Loading json files
                if (path.endsWith('.json')) {
                    json = (0, fs_extra_1.readFileSync)(path, 'utf-8');
                    return [2 /*return*/, JSON.parse(json)];
                }
                // todo: handle other files types
                // - yml
                throw new Error('CONFIG_WRONG_FORMAT');
        }
    });
}); };
/**
 * Parse config based on command params
 * @param params input params
 * @returns orm config
 */
var parseConfig = function (params) { return __awaiter(void 0, void 0, void 0, function () {
    var config, configuration, entitiesDirectory, migrationsDirectory, snapshotsDirectory, typesDirectory, res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (params.verbose)
                    (0, log_1.broadcast)(chalk_1.chalk.dim('Loading orm config...'));
                return [4 /*yield*/, (0, exports.loadFile)(params.config).catch(function (err) {
                        if (err === 'CONFIG_MISSING') {
                            if (params.verbose)
                                (0, log_1.broadcast)(chalk_1.chalk.dim('No config file found, using default value...'));
                            return {
                                driver: 'postgres',
                            };
                        }
                        // todo: handle errors
                        cli_1.program.error("Failed to load config: ".concat(err.message));
                        return { driver: 'postgres' };
                    })];
            case 1:
                config = _a.sent();
                configuration = __assign(__assign({}, config), params);
                entitiesDirectory = getDirectory(configuration.entities || '.orm/entities', params.config);
                migrationsDirectory = getDirectory(configuration.migrations || '.orm/migrations', params.config);
                snapshotsDirectory = getDirectory(configuration.snapshots || '.orm/snapshots', params.config);
                typesDirectory = getDirectory(configuration.types || '.', params.config);
                // Creating directories if they dont exist
                return [4 /*yield*/, Promise.all([
                        (0, fs_extra_1.ensureDir)(entitiesDirectory),
                        (0, fs_extra_1.ensureDir)(migrationsDirectory),
                        (0, fs_extra_1.ensureDir)(snapshotsDirectory),
                        (0, fs_extra_1.ensureDir)(typesDirectory),
                    ])];
            case 2:
                // Creating directories if they dont exist
                _a.sent();
                res = __assign(__assign({}, configuration), { entitiesDirectory: entitiesDirectory, migrationsDirectory: migrationsDirectory, snapshotsDirectory: snapshotsDirectory, typesDirectory: configuration.types && typesDirectory });
                global.config = res;
                if (res.verbose)
                    process.env.DEBUG = 'orm';
                (0, log_1.debug)();
                (0, log_1.debug)(chalk_1.chalk.dim('Options loaded: '));
                (0, log_1.debug)(chalk_1.chalk.dim((0, log_1.formatObject)(res)));
                return [2 /*return*/, res];
        }
    });
}); };
exports.parseConfig = parseConfig;
var getDirectory = function (dir, configFile) {
    if ((0, path_1.isAbsolute)(dir))
        return dir;
    var segments = configFile.split('/');
    if (configFile.endsWith('.js') || configFile.endsWith('.ts') || configFile.endsWith('.json'))
        segments.pop();
    var configDir = segments.join('/');
    if ((0, path_1.isAbsolute)(configDir))
        return (0, path_1.join)(configDir, dir || '.');
    return (0, path_1.join)(process.cwd(), configDir, dir || '.');
};
var typeImport = process.env.NODE_ENV === 'development' ? './src/types' : 'undiorm/src/types';
var template = "import { iOrmConfig } from '".concat(typeImport, "';\n\nconst config = async (): Promise<iOrmConfig> => {\n  return __TEMPLATE__\n};\n\nexport default config;\n");
/**
 * Save orm config to file
 * @param config
 */
var saveConfig = function (config) { return __awaiter(void 0, void 0, void 0, function () {
    var content;
    return __generator(this, function (_a) {
        try {
            content = (0, formatter_1.prettier)(template.replace('__TEMPLATE__', JSON.stringify(config)), { parser: 'babel-ts' });
            (0, fs_extra_1.writeFileSync)((0, path_1.join)(process.cwd(), '.ormconfig.ts'), content, 'utf-8');
        }
        catch (error) { }
        return [2 /*return*/];
    });
}); };
exports.saveConfig = saveConfig;
