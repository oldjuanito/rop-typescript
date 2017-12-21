"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rop_1 = require("./rop/rop");
function failAsync(errors) {
    return new Promise(function (resolve) { return resolve(rop_1.fail(errors)); });
}
exports.failAsync = failAsync;
function isAsyncResult(s) {
    return s.then !== undefined;
}
exports.isAsyncResult = isAsyncResult;
