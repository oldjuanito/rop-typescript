import { createStepFunc } from '../workflowStepMappers'
import { fail, pass, PropertyError, RopBind, RopResult } from '../rop/rop'
import { assertFailedWorkflow, assertSuccesfulWorkflow } from './helpers/testHelpers'
import { WorkflowResultMonad } from '../monads/workflow'
import Test = jest.Test
import { ResultForWorkflow } from '../editTypes'



// class Step<I, O> {
//     createNextStepExecution: (input:O) => {}
//     constructor(readonly applyFunc: (input:I)=>O) {
//
//     }
//     compose<O2>(nextApplyFunc: (input:O)=>O2) {
//         this.createNextStepExecution = (input:O) => new Step(nextApplyFunc)
//     }
// }

describe('test suite description', () => {

    beforeEach(function() {
        const originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
    });
    interface TestRendition {
        numerator: number,
        denominator: number
    }
    interface TestDomain {
        divisionRes: number
    }
    interface TestContext {
        domain?: TestDomain
        inputs: TestRendition
    }
    function doDiv(rend: TestRendition) {
        if (rend.denominator === 0) {
            return fail([{ errorDescription: `Denominator is zero`}])
        }
        const res: TestDomain = { divisionRes: rend.numerator / rend.denominator }
        return pass(res)
    }
    it('validates ', () => {
        //Arrange
        const context: TestContext = {
            inputs: {
                numerator: 4,
                denominator: 2
            }
        }
        const expectedContextData: TestContext = {
            inputs: {
                numerator: 4,
                denominator: 2
            },
            domain: { divisionRes: 2 }
        }
        const step = createStepFunc({
                func: doDiv,
                inputMapper: (c: TestContext) => c.inputs,
                outputMapper: (c: TestContext, funcGoodRes: TestDomain) => { return { ...c, domain: funcGoodRes} }
            }
        )
        // //Act
        //
        const instances = [ step ]
        //
        // //Assert
        assertSuccesfulWorkflow(context, expectedContextData, instances)
        // assertFailedWorkflow(context, [{ errorDescription: `Denominator is zero`}], instances)
    })

    it('validates ', () => {
        //Arrange
        const context: TestContext = {
            inputs: {
                numerator: 4,
                denominator: 2
            }
        }
        const expectedContextData: TestContext = {
            inputs: {
                numerator: 4,
                denominator: 2
            },
            domain: { divisionRes: 2 }
        }
        const step = createStepFunc({
                func: doDiv,
                inputMapper: (c: TestContext) => c.inputs,
                outputMapper: (c: TestContext, funcGoodRes: TestDomain) => { return { ...c, domain: funcGoodRes} }
            }
        )
        // //Act
        //
        const instances = [ step ]
        //
        // //Assert
        assertSuccesfulWorkflow(context, expectedContextData, instances)
        // assertFailedWorkflow(context, [{ errorDescription: `Denominator is zero`}], instances)
    })
    it('validates monads', () => {
        //Arrange

        function doDiv2(rend: TestRendition) {
            if (rend.denominator === 0) {
                return fail([{ errorDescription: `Denominator is zero`}])
            }
            const res: TestDomain = { divisionRes: rend.numerator / rend.denominator }
            return pass(res)
        }

        const context: TestContext = {
            inputs: {
                numerator: 4,
                denominator: 2
            }
        }
        const expectedContextData: TestContext = {
            inputs: {
                numerator: 4,
                denominator: 2
            },
            domain: { divisionRes: 2 }
        }
        const step = createStepFunc({
                func: doDiv,
                inputMapper: (c: TestContext) => c.inputs,
                outputMapper: (c: TestContext, funcGoodRes: TestDomain) => { return { ...c, domain: funcGoodRes} }
            }
        )
        function later(delay: number): (d: TestDomain) => Promise<ResultForWorkflow<TestDomain>> {
            return (d: TestDomain) =>
                new Promise(function(resolve) {
                    setTimeout(function() {
                        resolve(pass(d));
                    }, delay); // Note the order, `delay` before `value`
                    /* Or for outdated browsers that don't support doing that:
                    setTimeout(function() {
                        resolve(value);
                    }, delay);
                    Or alternately:
                    setTimeout(resolve.bind(null, value), delay);
                    */
                });
        }
        // //Act
        //
        const input: TestRendition = { numerator: 4, denominator: 2 }
        const monad: RopResult<TestDomain, PropertyError[]> = async (
                RopBind.startRop<TestRendition, PropertyError[]>(input)
                .then(doDiv2)
                .thenAsync(later(5))
            )
        //
        // //Assert
        assertSuccesfulWorkflow(context, expectedContextData, instances)
        // assertFailedWorkflow(context, [{ errorDescription: `Denominator is zero`}], instances)
    })
})