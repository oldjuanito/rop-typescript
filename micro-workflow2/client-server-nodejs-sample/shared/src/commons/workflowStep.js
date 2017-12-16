"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isAsyncResult(s) {
    return s.then !== undefined;
}
exports.isAsyncResult = isAsyncResult;
