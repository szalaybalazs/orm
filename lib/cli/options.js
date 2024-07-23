"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addOptions = void 0;
var addOptions = function (command) {
    return command
        .option('-e, --entities <entities directory>', 'Directory containing all the entities')
        .option('-m, --migrations <migrations directory>', 'Directory containing all the migrations')
        .option('-s, --snapshots <snapshots directory>', 'Directory containing all the snapshots')
        .option('-t, --types <types directory>', 'Directory used to export all the types')
        .option('-c, --config <config file>', 'Path to the config file', '.')
        .option('--verbose');
};
exports.addOptions = addOptions;
