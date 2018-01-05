import { SyncWorkflowStep } from '../../../../shared/src/commons/workflowStep'
import { BasicComponent, ViewDescription } from '../components/BasicComponent'
import { setDropDownViewOptsStep } from '../../../../shared/src/commons/steps/setDropDownViewOptsStep'
import { createErrorRenderViewValuesStep } from '../steps/renderErrorsStep'
import { setInputTxtViewValuesStep } from '../../../../shared/src/commons/steps/setInputTxtViewValuesStep'
import { setDisplayTxtViewValuesStep } from '../../../../shared/src/commons/steps/setDisplayTxtViewValuesStep'

export function buildRenderWorkflowSteps<DomainType,
    InputType, ViewType, SupportingDataType>(descriptors: ViewDescription<BasicComponent<DomainType,
    InputType, ViewType, SupportingDataType>>): SyncWorkflowStep<BasicComponent<DomainType,
    InputType, ViewType, SupportingDataType>>[] {
    type BasicComponentT = BasicComponent<DomainType,
        InputType, ViewType, SupportingDataType>
    const renderOpts = setDropDownViewOptsStep(
        descriptors.fieldsWithOpts, (context) => context.view)
    const renderInputs = setInputTxtViewValuesStep(
        descriptors.editTxtFields,
        (context: BasicComponentT) => context.view,
        (context: BasicComponentT) => context.input
    )
    const renderDisplayTxts = setDisplayTxtViewValuesStep(
        descriptors.readonlyFields,
        (context: BasicComponentT) => context.view,
        (context: BasicComponentT) => context.input
    )
    return [
        renderOpts,
        renderInputs,
        renderDisplayTxts,
        createErrorRenderViewValuesStep()
    ]
}