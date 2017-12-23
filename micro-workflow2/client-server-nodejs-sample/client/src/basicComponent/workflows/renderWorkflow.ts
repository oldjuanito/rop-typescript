import { SyncWorkflowStep } from '../../../../shared/src/commons/workflowStep'
import { BasicComponent, ViewDescription } from '../components/BasicComponent'
import { setDropDownViewOptsStep } from '../../../../shared/src/commons/steps/setDropDownViewOptsStep'
import { createErrorRenderViewValuesStep } from '../steps/renderErrorsStep'

export function buildRenderWorkflowSteps<DomainType,
    InputType, ViewType, SupportingDataType>(descriptors: ViewDescription<BasicComponent<DomainType,
    InputType, ViewType, SupportingDataType>>): SyncWorkflowStep<BasicComponent<DomainType,
    InputType, ViewType, SupportingDataType>>[] {

    const renderOpts = setDropDownViewOptsStep(
        descriptors.fieldsWithOpts, (context) => context.view)
    return [
        renderOpts,
        createErrorRenderViewValuesStep()
    ]
}