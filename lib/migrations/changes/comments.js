"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommentChanges = void 0;
/**
 * Caclulate changes for comments
 * @param state current state of the table
 * @param snapshot previous state of the table
 * @returns
 */
var getCommentChanges = function (state, snapshot) {
    var changes = {};
    var columns = Array.from(new Set(__spreadArray(__spreadArray([], Object.keys(state.columns), true), Object.keys(snapshot.columns), true)));
    columns.forEach(function (key) {
        var _a, _b, _c, _d;
        var newComment = (_b = (_a = state.columns) === null || _a === void 0 ? void 0 : _a[key]) === null || _b === void 0 ? void 0 : _b.comment;
        var oldComment = (_d = (_c = snapshot.columns) === null || _c === void 0 ? void 0 : _c[key]) === null || _d === void 0 ? void 0 : _d.comment;
        if (newComment === oldComment)
            return;
        changes[key] = {
            from: oldComment,
            to: newComment,
        };
    });
    return changes;
};
exports.getCommentChanges = getCommentChanges;
