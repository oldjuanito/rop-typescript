import { createStepFunc } from '../workflowStepMappers'
import { assertSuccesfulWorkflow } from './helpers/testHelpers'
import { ShortName, shortNamePropCreateStep, ShortNameRendition } from '../typeValidators/shortNameProp'
import { toDomain, ToDomainOptions } from '../typeValidators/mapRenditionToDomainStep'
import { SyncWorkflowStep } from '../workflowStep'



// class Step<I, O> {
//     createNextStepExecution: (input:O) => {}
//     constructor(readonly applyFunc: (input:I)=>O) {
//
//     }
//     compose<O2>(nextApplyFunc: (input:O)=>O2) {
//         this.createNextStepExecution = (input:O) => new Step(nextApplyFunc)
//     }
// }

describe('test suite for property edits', () => {
    interface TestRendition {
        clientName: ShortNameRendition
    }
    interface TestDomain {
        clientName: ShortName
    }
    interface TestContext {
        domain?: TestDomain
        inputs: TestRendition
    }
    // function doEditClient(rend: TestRendition) {
    //     if (rend.denominator === 0) {
    //         return fail([{ errorDescription: `Denominator is zero`}])
    //     }
    //     const res: TestDomain = { divisionRes: rend.numerator / rend.denominator }
    //     return pass(res)
    // }
    it('validates ', () => {
        //Arrange
        const context: TestContext = {
            inputs: {
                clientName: 'Juanito'
            }
        }
        const expectedContextData: TestContext = {
            inputs: {
                clientName: 'Juanito'
            },
            domain: { clientName: 'Juanito' }
        }
        const step: SyncWorkflowStep<TestContext> = createStepFunc({
                func: toDomain,
                inputMapper:
                    (c: TestContext): ToDomainOptions<TestRendition, TestDomain> =>
                    {  return {
                        currDomain: c.domain,
                        rendition: c.inputs,
                        propsToCheck: {
                            clientName: shortNamePropCreateStep
                        }
                    }},
                outputMapper: (c: TestContext, funcGoodRes: TestDomain) =>
                    { return { ...c, domain: funcGoodRes} }
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