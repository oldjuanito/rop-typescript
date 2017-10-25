
export const GOOD = 'Good'
export type GOOD = typeof GOOD
export const BAD = 'Bad'
export type BAD = typeof BAD

export interface Good<T> {
    kind: GOOD
    payload: T
} 

export interface Bad<ErrType> {
    kind: BAD
    error: ErrType
} 
export interface PropertyError {
    errorDescription: string
} 
export function getErrorsAsString(errs: PropertyError[]) {
    return errs.map((currVal) => currVal.errorDescription)
}
export type RopResult<T, ErrType>  =  Good<T> | Bad<ErrType>

function pass<T>(payload: T): Good<T> {
    return { kind: GOOD,  payload }
}

function fail<T>(error: T): Bad<T> {
    return { kind: BAD, error }
}
// function failWithDesc(error: string): Bad<PropertyError> {
//     return { kind: BAD, error: { errorDescription: error } }
// }

export class RopBind<A, ErrType> {
    constructor(private firstResult: RopResult<A, ErrType>) {

    }
    then<T>(nextFunc: (input: A) => RopResult<T, ErrType>) {
        const nextResult = this.thenResult(nextFunc)
        return new RopBind(nextResult)
    }
    map<T>(nextFunc: (input: A) => T) {
        const nextResult = this.thenMap(nextFunc)
        return new RopBind(nextResult)
    }
    getResult() {
        return this.firstResult
    }
    
    private thenMap<T>(nextFunc: (input: A) => T) {
        const firstResult = this.firstResult
        switch (firstResult.kind) {
            case GOOD :
                const secondRes = pass(nextFunc(firstResult.payload))
                return secondRes
            case BAD :
                return (firstResult)
            default:
                return (firstResult)

        }
    }
    private thenResult<T>(nextFunc: (input: A) => RopResult<T, ErrType>) {
        const firstResult = this.firstResult
        switch (firstResult.kind) {
            case GOOD :
                const secondRes = nextFunc(firstResult.payload)
                return secondRes
            case BAD :
                return (firstResult)
            default:
                return (firstResult)

        }
    }
}

// function thenResult<T, A, ErrType>(nextFunc: (input: A) => RopResult<T, ErrType>, firstResult: RopResult<A, ErrType>) {
//     switch (firstResult.kind) {
//         case GOOD :
//             const secondRes = nextFunc(firstResult.payload)
//             return secondRes
//         case BAD :
//             return (firstResult)
//         default:
//             return (firstResult)

//     }
// }
// export module Rop {
//     export function createTrack<I1, I2,  FinalRes, ErrType>(
//             func1: (input: I1) => RopResult<I2, ErrType>, 
//             func2: (input: I2) => RopResult<FinalRes, ErrType>) {
                
//                 return function (startInput: I1) {
//                     let r1 = func1(startInput)
//                     let r2 = thenResult(func2, r1)
//                     return r2
//                 } 
        
//             }
//     export function createTrack<I1, I2, I3, O3, ErrType>(
//         func1: (input: I1) => RopResult<I2, ErrType>, 
//         func2: (input: I2) => RopResult<I3, ErrType>, 
//         func3: (input: I3) => RopResult<O3, ErrType>) {
            
//             return function (startInput: I1) {
//                 let r1 = func1(startInput)
//                 let r2 = thenResult(func2, r1)
//                 let r3 = thenResult(func3, r2)
//                 return r3
//             } 

//         }
// }

// export function createTrack<I1, I2, I3, O3, ErrType>(
//     startInput: I1, 
//     func1: (input: I1) => RopResult<I2, ErrType>, 
//     func2?: (input: I2) => RopResult<I3, ErrType>, 
//     func3?: (input: I3) => RopResult<O3, ErrType>) {
        
//         const funcs: (input: any) => RopResult<I2, ErrType> = []
//         if (func2) {
//             funcs
//         }
        

//     }
// export function createTrackArra<I1, I2, I3, I4, ErrType>(
//     startInput: I1, 
//     funcs: (((input: I1) => RopResult<I2, ErrType> )
//             | ((input: I2) => RopResult<I3, ErrType>)
//             | ((input: I3) => RopResult<I4, ErrType>) )[]
// ) {
    
    
// }
export function startTrack<A, ErrType>(firstResult: RopResult<A, ErrType>) {
    return new RopBind(firstResult)
    // return {
    //     then: function (nextFunc: (input: A) => RopResult<T, ErrType>) {
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
export function runValidateIf<A, ErrType>(evaluate: boolean, evalFunc: (input: A) => RopResult<A, ErrType>, input: A) {
    if (evaluate) {
        return evalFunc(input)
    } else {
        return pass(input)
    }
}

export module Validations {

    export function passIfTrue< A>(nextFunc: (input: A) => boolean, errMsg: string, subject: A) {
        const evalRes = nextFunc(subject)
        const secondRes = evalRes ? pass(subject) : fail({ errorDescription: errMsg})
        return secondRes
    }
    export function isWithinRange(min: number, max: number, subject: number): 
        RopResult<number, PropertyError> {
        if (subject >= min && subject <= max) {
            return pass(subject )
        } else {
            return fail( { errorDescription: `Must be between ${min} and ${max}` }  )
        }
    }
    export function tryDate(subject: string): 
        RopResult<Date, PropertyError> {
        if (isNullOrEmpty(subject)) {
            return pass( new Date() )
        }
        const parsedSubject = new Date(subject)
        if (parsedSubject.toString() === 'Invalid Date') {
            return fail( { errorDescription: 'Must be a valid date' }  )
        } else {
            return pass( parsedSubject )
        }
    }
    export function isDateWithinRange(min: Date, max: Date, subject: Date): 
        RopResult<Date, PropertyError> {
        if (subject >= min && subject <= max) {
            return pass(subject )
        } else {
            return fail( { errorDescription: `Must be between ${min.toDateString()} and ${max.toDateString()}` }  )
        }
    }

    // export curriedIsWithinRange

    export function isNumberKeepStr(subject: string): 
        RopResult<string, PropertyError> {
        if (isNullOrEmpty(subject)) {
            return pass( '' )
        }
        const parsedNum = Number(subject)
        if (isNullOrEmpty(subject) || isNaN(parsedNum)) {
            return fail( { errorDescription: 'Must be a valid number' }  )
        } else {
            return pass(subject )
        }
    }
    export function tryNumber(subject: string): 
        RopResult<number, PropertyError> {
        if (isNullOrEmpty(subject)) {
            return pass( 0 )
        }
        const parsedNum = Number(subject)
        if (isNaN(parsedNum)) {
            return fail( { errorDescription: 'Must be a valid number' }  )
        } else {
            return pass( parsedNum )
        }
    }
    export function isNullOrEmpty(subject: string | number) {
        return (subject == null || subject.toString().trim() === '')
    }
    export function hasValue(subject: string | number): 
        RopResult<string, PropertyError> {
        if (isNullOrEmpty(subject)) {
            return fail( { errorDescription: 'Must not be empty' }  )
        } else {
            return pass(subject.toString() )
        }
    }
    export function isInteger(subject: number): 
        RopResult<number, PropertyError> {
        if (subject % 1 !== 0) {
            return fail( { errorDescription: 'Must be integer' }  )
        } else {
            return pass(subject)
        }
    }
    export function isCorrectLen(min: number, max: number, subject: string): 
        RopResult<string, PropertyError> {
        const len = subject.length
        if (isNullOrEmpty(subject) || (len >= min && len <= max)) {
            return pass(subject )
        } else {
            return fail( { errorDescription: `Length must be between ${min} and ${max}` }  )
        }
    }
    export function isOneOf(choices: string[], subject: string): 
        RopResult<string, PropertyError> {
        if (choices.findIndex((currval) => currval === subject) >= 0) {
            return pass(subject )
        } else {
            const choicesStr = choices.join(', ')
            return fail( { errorDescription: `Must be one of the following: ${choicesStr}` }  )
        }
    }
    export function isNumberAndWithinRange(min: number, max: number, subject: string) {
        const curriedIsWithinRange = (subject2: number) => isWithinRange(min, max, subject2)
        // const workflow =
        //     start(tryNumber(subject))
        //     .then(curriedIsWithinRange);
        const result =
            startTrack(tryNumber(subject))
            .then(curriedIsWithinRange)
            .then(curriedIsWithinRange)
            .getResult()
        return result
    }

}