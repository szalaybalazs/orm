"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatSql = void 0;
var chalk_1 = require("./chalk");
var log_1 = require("./log");
var formatter_1 = require("../utils/formatter");
var formatSql = function (sql) {
    try {
        return (0, formatter_1.prettier)(sql, {
            language: 'postgresql',
            expressionWidth: 60,
            keywordCase: 'upper',
        });
    }
    catch (error) {
        (0, log_1.debug)(chalk_1.chalk.dim('Failed to format SQL: '), error.message);
        return sql;
    }
};
exports.formatSql = formatSql;
