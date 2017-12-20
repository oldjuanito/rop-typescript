import { Monad, Functor, Eq, eq } from './monad'

/**
 * @name EitherType
 * @description Enumerate the different types contained by an Either object.
 */
export enum WorkflowResultType { Failure, Success }

/**
 * @name EitherPatterns
 * @description Define a contract to unwrap Either object using callbacks
 *     for Failure and Success.
 * @see Either#
 */
export interface WorkflowResultTypePatterns<L,R,T> {

    success: (success: R) => T;

    failure: (failure: L) => T;
}

// ditto, but optional
export type OptionalWorkflowResultTypePatterns<L,R,T> = Partial<WorkflowResultTypePatterns<L,R,T>>

function exists<T>(t: T) {
    return t !== null && t !== undefined;
}

/**
 * @name either
 * @description Build an Either object.
 * @function
 * @param l The object as a Failure (optional).
 * @param r The object as a Success (optional).
 * @returns {Either<L, R>} Either object containing the input.
 * @throws {TypeError} If there are both or none of failure and success
 *     parameter.
 * @see Either#
 */
export function workflowResult<L,R>(failure?: L, success?: R) {
    if (exists(failure) && exists(success)) {
        throw new TypeError('Cannot construct an WorkflowResult with both a failure and a success');
    }
    if (!exists(failure) && !exists(success)) {
        throw new TypeError('Cannot construct an WorkflowResult with neither a failure nor a success');
    }
    if (exists(failure) && !exists(success)) {
        return WorkflowResult.failure<L,R>(failure as L);
    }
    if (!exists(failure) && exists(success)) {
        return WorkflowResult.success<L,R>(success as R);
    }
    throw new TypeError('Cannot happen!');
}

/**
 * @name Either
 * @class Either has exactly two sub types, Failure (L) and Success (R). If an
 *     Either<L, R> object contains an instance of L, then the Either is a
 *     Failure. Otherwise it contains an instance of R and is a Success. By
 *     convention, the Failure constructor is used to hold an error value and
 *     the Success constructor is used to hold a correct value.
 */
export class WorkflowResult<L,R> implements Monad<R>, Functor<R>, Eq<WorkflowResult<L,R>> {

    /**
     * @description Build an WorkflowResult object. For internal use only.
     * @constructor
     * @methodOf WorkflowResult#
     * @param {WorkflowResultType} type Indicates if the WorkflowResult content is a Failure or a Success.
     * @param {L} l The Failure value (optional).
     * @param {R} l The Success value (optional).
     */
    constructor(private type: WorkflowResultType,
                private failure?: L,
                private sucess?: R) {}

    /**
     * @name failure
     * @description Helper function to build an WorkflowResult with a Failure.
     * @methodOf WorkflowResult#
     * @static
     * @param {L} l The Failure value.
     * @returns {WorkflowResult<L, R>} WorkflowResult object containing a Failure.
     */
    static failure<L,R>(l: L) {
        return new WorkflowResult<L,R>(WorkflowResultType.Failure, l);
    }

    /**
     * @name success
     * @description Helper function to build an WorkflowResult with a Success.
     * @methodOf WorkflowResult#
     * @static
     * @param {R} r The Success value.
     * @returns {WorkflowResult<L, R>} WorkflowResult object containing a Success.
     */
    static success<L,R>(r: R) {
        return new WorkflowResult<L,R>(WorkflowResultType.Success, undefined, r);
    }

    /**
     * @name unit
     * @description Wrap a value inside an WorkflowResult Success object.
     * @methodOf WorkflowResult#
     * @public
     * @param {T} t
     * @returns {WorkflowResult<L, R>} WorkflowResult object containing a Success.
     * @see Monad#unit
     */
    unit<T>(t: T) {
        return WorkflowResult.success<L,T>(t);
    }

    /**
     * @name bind
     * @description Apply the function passed as parameter on the object.
     * @methodOf WorkflowResult#
     * @public
     * @param {(r: R) => WorkflowResult<L, T>} f Function applied on the Success.
     * @returns {WorkflowResult<L, T>} The result of the function f wrapped inside
     *     an WorkflowResult object.
     * @see Monad#bind
     */
    bind<T>(f: (r: R) => WorkflowResult<L,T>) {
        return this.type === WorkflowResultType.Success ?
            f(this.sucess as R) :
            WorkflowResult.failure<L,T>(this.failure as L);
    }

    /**
     * @name of
     * @description Alias for unit.
     * @methodOf WorkflowResult#
     * @public
     * @see WorkflowResult#unit
     * @see Monad#of
     */
    of = this.unit;

    /**
     * @name chain
     * @description Alias for bind.
     * @methodOf WorkflowResult#
     * @public
     * @see WorkflowResult#bind
     * @see Monad#chain
     */
    chain = this.bind;

    /**
     * @name fmap
     * @description Apply the function passed as parameter on the object.
     * @methodOf WorkflowResult#
     * @public
     * @param {(r: R) => T} f Function applied on the Success.
     * @returns {WorkflowResult<L, T>} The result of the function f wrapped inside
     *     an WorkflowResult object.
     * @see Functor#fmap
     */
    fmap<T>(f: (r: R) => T) {
        return this.bind(v => this.unit<T>(f(v)));
    }

    /**
     * @name lift
     * @description Alias for fmap.
     * @methodOf WorkflowResult#
     * @public
     * @see WorkflowResult#fmap
     * @see Functor#lift
     */
    lift = this.fmap;

    /**
     * @name map
     * @description Alias for fmap.
     * @methodOf WorkflowResult#
     * @public
     * @see WorkflowResult#fmap
     * @see Functor#map
     */
    map = this.fmap;

    /**
     * @name caseOf
     * @description Execute a function depending on the WorkflowResult content.
     *     It allows to unwrap the object for Failure or Success types.
     * @methodOf WorkflowResult#
     * @public
     * @param {WorkflowResultTypePatterns<L, R, T>} pattern Object containing the
     *     functions to applied on each WorkflowResult types.
     * @return {T} The returned value of the functions specified in the
     *     WorkflowResultTypePatterns interface.
     * @see WorkflowResultTypePatterns#
     */
    caseOf<T>(pattern: WorkflowResultTypePatterns<L,R,T>) {
        return this.type === WorkflowResultType.Success ?
            pattern.success(this.sucess as R) :
            pattern.failure(this.failure as L);
    }

    /**
     * @name equals
     * @description Compare the type and the content of two WorkflowResult
     *     objects.
     * @methodOf WorkflowResult#
     * @public
     * @param {WorkflowResult<L, R>} other The WorkflowResult to compare with.
     * @return {boolean} True if the type and content value are equals,
     *     false otherwise.
     * @see Eq#equals
     */
    equals(other: WorkflowResult<L,R>) {
        return other.type === this.type &&
            ((this.type === WorkflowResultType.Failure && eq(other.failure, this.failure)) ||
                (this.type === WorkflowResultType.Success && eq(other.sucess, this.sucess)));
    }

    /**
     * @name do
     * @description Execute a function based on the WorkflowResult content. Returns the
     *     original value, so is meant for running functions with side-effects.
     * @methodOf WorkflowResult#
     * @public
     * @param {Partial<WorkflowResultTypePatterns<T, U>>} pattern Object containing the
     *     functions to applied on each WorkflowResult type.
     * @return The original WorkflowResult value.
     * @see WorkflowResultTypePatterns#
     */
    do(patterns: Partial<WorkflowResultTypePatterns<L, R, void>> = {}): WorkflowResult<L, R> {
        let noop_pattern = {
            failure: (l: L) => {},
            success: (r: R) => {},
        };
        let merged = Object.assign(noop_pattern, patterns);
        this.caseOf(merged);
        return this;
    }
}

