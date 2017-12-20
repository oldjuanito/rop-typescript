import { eq, Eq, Functor, Monad } from './monad'
import { pass, RopResult, fail, GOOD, BAD } from '../rop/rop'

export type MonadMiddleware<ErrType> = (result: RopResult<any, ErrType>, stepName: string) => void

export class WorkflowResultMonad<T, ErrType> implements Monad<T>, Functor<T>, Eq<WorkflowResultMonad<T, ErrType>> {

    constructor(readonly result: RopResult<T, ErrType>, private middleware:MonadMiddleware<ErrType>[] = []) {

    }
    static failure<T, ErrType>(l: ErrType, middleware:MonadMiddleware<ErrType>[] = []) {
        return new WorkflowResultMonad<T, ErrType>(fail(l), middleware);
    }

    static result<T, ErrType>(l: RopResult<T, ErrType>, middleware:MonadMiddleware<ErrType>[] = []) {
        return new WorkflowResultMonad<T, ErrType>(l, middleware);
    }
    static success<T, ErrType>(r: T, middleware:MonadMiddleware<ErrType>[] = []) {
        return new WorkflowResultMonad<T, ErrType>(pass(r), middleware);
    }
    unit<T>(t: T) {
        return WorkflowResultMonad.success<T,ErrType>(t);
    }

    bind<U>(f: (t: T) => WorkflowResultMonad<U, ErrType>) {
        return this.bindWithName(f)
    }
    bindWithName<U>(f: (t: T) => WorkflowResultMonad<U, ErrType>, stepName?: string )
    :WorkflowResultMonad<U, ErrType> {
        const res = this.result
        const stepNameToUse = stepName || 'workflow step'
        for (let middlewareIdx = 0; middlewareIdx < this.middleware.length; middlewareIdx++) {
            const middleware = this.middleware[middlewareIdx];
            middleware(res, stepNameToUse)
        }
        switch (res.kind) {
            case GOOD :
                return f(res.payload)
            case BAD :
                return WorkflowResultMonad.result<U,ErrType>(res, this.middleware)
            default:
                return WorkflowResultMonad.result<U,ErrType>(res, this.middleware )
        }
    }

    of = this.unit;

    chain = this.bind;

    fmap<U>(f: (t: T) => U) {
        const liftedFunc = (v: T) => this.unit<U>(f(v))
        return this.bindWithName(liftedFunc, f.name);
    }

    lift = this.fmap;

    then<U>(f: (t: T) => RopResult<U, ErrType>): WorkflowResultMonad<U, ErrType> {
        const liftedFunc = (v: T) => new WorkflowResultMonad<U, ErrType>(f(v), this.middleware)
        return this.bindWithName(liftedFunc, f.name);
    }
    // async asyncThen<U>(f: (t: T) => Promise<RopResult<U, ErrType>>): WorkflowResultMonad<U, ErrType> {
    //
    //     const liftedFunc = (v: T) => new WorkflowResultMonad<U, ErrType>(, this.middleware)
    //     return this.bindWithName(liftedFunc, f.name);
    // }

    map = this.fmap;

    equals(other: WorkflowResultMonad<T, ErrType>) {
        const otherResult = other.result
        const myResult = this.result
        return otherResult.kind === myResult.kind &&
            ((myResult.kind === BAD && otherResult.kind === BAD && eq(otherResult.error, myResult.error)) ||
                (myResult.kind === GOOD && otherResult.kind === GOOD && eq(otherResult.payload, myResult.payload)));
    }

}