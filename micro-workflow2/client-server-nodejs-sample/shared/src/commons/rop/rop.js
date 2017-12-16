"use strict";
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
// function failWithDesc(error: string): Bad<PropertyError> {
//     return { kind: BAD, error: { errorDescription: error } }
// }
var RopBind = /** @class */ (function () {
    function RopBind(firstResult) {
        this.firstResult = firstResult;
    }
    RopBind.prototype.then = function (nextFunc) {
        var nextResult = this.thenResult(nextFunc);
        return new RopBind(nextResult);
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
