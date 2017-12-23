
import { BasicComponentInitialization, ViewDescription } from '../components/BasicComponent'
import { SyncWorkflowStep } from '../../../../shared/src/commons/workflowStep'
import { wireDisplayElemViewStep } from '../../../../shared/src/commons/steps/wireDisplayElemViewStep'
import { wireTextInputStep } from '../../../../shared/src/commons/steps/wireTextInputStep'
import { wireActionBtnStep } from '../../../../shared/src/commons/steps/wireActionBtnStep'
import { InputMsg } from '../../../../shared/src/commons/editTypes'

export function buildWireViewElementsWorkflow<DomainType,
    InputType, ViewType, SupportingDataType>(descriptors: ViewDescription<BasicComponentInitialization<DomainType,
    InputType, ViewType, SupportingDataType>>): SyncWorkflowStep<BasicComponentInitialization<DomainType,
    InputType, ViewType, SupportingDataType>>[] {
    type ComponentType = BasicComponentInitialization<DomainType,
        InputType, ViewType, SupportingDataType>
    const wireViewELementsStep = wireDisplayElemViewStep<ComponentType, ViewType>(
        descriptors.viewScopeName,
        descriptors.readonlyFields,
        (context) => context.view,
        (context, view) => { return {...context, view}}
    )
    const wireEditElementsStep = wireTextInputStep<ComponentType, ViewType>(
        descriptors.viewScopeName,
        descriptors.editTxtFields,
        (context) => context.msgSender as ((msg: InputMsg) => void),
        (context) => context.view,
        (context, view) => { return {...context, view}}
    )

    const wireActionsSteps = wireActionBtnStep<ComponentType, ViewType>(
        descriptors.viewScopeName,
        descriptors.actionStarters,
        (context) => context.msgSender as ((msg: InputMsg) => void),
        context => context.view,
        (context, view) => {return {...context, view }}
    )

    const errFields = [{name: 'currErrors'}]
    const htmlErrorsSetupStep: SyncWorkflowStep<ComponentType> =
        wireDisplayElemViewStep<ComponentType, ViewType>(
            descriptors.viewScopeName,
            errFields,
            context => context.view,
            (context, view) => {
                return {...context, view}
            }
        )
    return [
        wireViewELementsStep,
        wireEditElementsStep,
        wireActionsSteps,
        htmlErrorsSetupStep
    ]
}