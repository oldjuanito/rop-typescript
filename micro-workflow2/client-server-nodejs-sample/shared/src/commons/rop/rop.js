"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
exports.GOOD = 'Good';
exports.BAD = 'Bad';
function getErrorsAsString(errs) {
    return errs.map(function (currVal) { return currVal.errorDescription; });
}
exports.getErrorsAsString = getErrorsAsString;
function pass(payload) {
    return { kind: exports.GOOD, payload: payload };
}
exports.pass = pass;
function fail(error) {
    return { kind: exports.BAD, error: error };
}
exports.fail = fail;
var RopBind = /** @class */ (function () {
    function RopBind(firstResult, middleware) {
        if (middleware === void 0) { middleware = []; }
        this.firstResult = firstResult;
    }
    RopBind.startRop = function (input, middleware) {
        if (middleware === void 0) { middleware = []; }
        return new RopBind(pass(input), middleware);
    };
    RopBind.prototype.then = function (nextFunc) {
        var nextResult = this.thenResult(nextFunc);
        return new RopBind(nextResult);
    };
    RopBind.prototype.thenAsync = function (nextFunc) {
        return __awaiter(this, void 0, void 0, function () {
            var nextResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.thenAsyncResult(nextFunc)];
                    case 1:
                        nextResult = _a.sent();
                        return [2 /*return*/, new RopBind(nextResult)];
                }
            });
        });
    };
    RopBind.prototype.map = function (nextFunc) {
        var nextResult = this.thenMap(nextFunc);
        return new RopBind(nextResult);
    };
    RopBind.prototype.getResult = function () {
        return this.firstResult;
    };
    RopBind.prototype.thenMap = function (nextFunc) {
        var firstResult = this.firstResult;
        switch (firstResult.kind) {
            case exports.GOOD:
                var secondRes = pass(nextFunc(firstResult.payload));
                return secondRes;
            case exports.BAD:
                return (firstResult);
            default:
                return (firstResult);
        }
    };
    RopBind.prototype.thenResult = function (nextFunc) {
        var firstResult = this.firstResult;
        switch (firstResult.kind) {
            case exports.GOOD:
                var secondRes = nextFunc(firstResult.payload);
                return secondRes;
            case exports.BAD:
                return (firstResult);
            default:
                return (firstResult);
        }
    };
    RopBind.prototype.thenAsyncResult = function (nextFunc) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var firstResult = _this.firstResult;
            switch (firstResult.kind) {
                case exports.GOOD:
                    var secondRes = nextFunc(firstResult.payload);
                    resolve(secondRes);
                    break;
                case exports.BAD:
                    resolve(firstResult);
                    break;
                default:
                    resolve(firstResult);
                    break;
            }
        });
    };
    return RopBind;
}());
exports.RopBind = RopBind;
function startTrack(firstResult) {
    return new RopBind(firstResult);
    // return {
    //     then: function (nextFunc: (rendition: A) => RopResult<T, ErrType>) {
    //         switch (firstResult.kind) {
    //             case GOOD :
    //                 const secondRes = nextFunc(firstResult.payload);
    //                 return secondRes;
    //             case BAD :
    //                 return (firstResult);
    //             default:
    //                 return failWithDesc('system error, default case');
    //         }
    //     }
    // };
}
exports.startTrack = startTrack;
function runValidateIf(evaluate, evalFunc, input) {
    if (evaluate) {
        return evalFunc(input);
    }
    else {
        return pass(input);
    }
}
exports.runValidateIf = runValidateIf;
var Validations;
(function (Validations) {
    function passIfTrue(nextFunc, errMsg, subject) {
        var evalRes = nextFunc(subject);
        var secondRes = evalRes ? pass(subject) : fail({ errorDescription: errMsg });
        return secondRes;
    }
    Validations.passIfTrue = passIfTrue;
    function isWithinRange(min, max, subject) {
        if (subject >= min && subject <= max) {
            return pass(subject);
        }
        else {
            return fail({ errorDescription: "Must be between " + min + " and " + max });
        }
    }
    Validations.isWithinRange = isWithinRange;
    function tryDate(subject) {
        if (isNullOrEmpty(subject)) {
            return pass(new Date());
        }
        var parsedSubject = new Date(subject);
        if (parsedSubject.toString() === 'Invalid Date') {
            return fail({ errorDescription: 'Must be a valid date' });
        }
        else {
            return pass(parsedSubject);
        }
    }
    Validations.tryDate = tryDate;
    function isDateWithinRange(min, max, subject) {
        if (subject >= min && subject <= max) {
            return pass(subject);
        }
        else {
            return fail({ errorDescription: "Must be between " + min.toDateString() + " and " + max.toDateString() });
        }
    }
    Validations.isDateWithinRange = isDateWithinRange;
    // export curriedIsWithinRange
    function isNumberKeepStr(subject) {
        if (isNullOrEmpty(subject)) {
            return pass('');
        }
        var parsedNum = Number(subject);
        if (isNullOrEmpty(subject) || isNaN(parsedNum)) {
            return fail({ errorDescription: 'Must be a valid number' });
        }
        else {
            return pass(subject);
        }
    }
    Validations.isNumberKeepStr = isNumberKeepStr;
    function tryNumber(subject) {
        if (isNullOrEmpty(subject)) {
            return pass(0);
        }
        var parsedNum = Number(subject);
        if (isNaN(parsedNum)) {
            return fail({ errorDescription: 'Must be a valid number' });
        }
        else {
            return pass(parsedNum);
        }
    }
    Validations.tryNumber = tryNumber;
    function isNullOrEmpty(subject) {
        return (subject == null || subject.toString().trim() === '');
    }
    Validations.isNullOrEmpty = isNullOrEmpty;
    function hasValue(subject) {
        if (isNullOrEmpty(subject)) {
            return fail({ errorDescription: 'Must not be empty' });
        }
        else {
            return pass(subject.toString());
        }
    }
    Validations.hasValue = hasValue;
    function isInteger(subject) {
        if (subject % 1 !== 0) {
            return fail({ errorDescription: 'Must be integer' });
        }
        else {
            return pass(subject);
        }
    }
    Validations.isInteger = isInteger;
    function isCorrectLen(min, max, subject) {
        var len = subject.length;
        if (isNullOrEmpty(subject) || (len >= min && len <= max)) {
            return pass(subject);
        }
        else {
            return fail({ errorDescription: "Length must be between " + min + " and " + max });
        }
    }
    Validations.isCorrectLen = isCorrectLen;
    function isOneOf(choices, subject) {
        if (choices.findIndex(function (currval) { return currval === subject; }) >= 0) {
            return pass(subject);
        }
        else {
            var choicesStr = choices.join(', ');
            return fail({ errorDescription: "Must be one of the following: " + choicesStr });
        }
    }
    Validations.isOneOf = isOneOf;
    function isNumberAndWithinRange(min, max, subject) {
        var curriedIsWithinRange = function (subject2) { return isWithinRange(min, max, subject2); };
        // const workflow =
        //     start(tryNumber(subject))
        //     .then(curriedIsWithinRange);
        var result = startTrack(tryNumber(subject))
            .then(curriedIsWithinRange)
            .then(curriedIsWithinRange)
            .getResult();
        return result;
    }
    Validations.isNumberAndWithinRange = isNumberAndWithinRange;
})(Validations = exports.Validations || (exports.Validations = {}));
