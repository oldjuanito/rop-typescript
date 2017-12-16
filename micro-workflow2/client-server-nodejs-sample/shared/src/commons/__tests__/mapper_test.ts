import { createStepFunc } from '../workflowStepMappers'
import { fail, pass } from '../rop/rop'
import { assertFailedWorkflow, assertSuccesfulWorkflow } from './helpers/testHelpers'



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
})