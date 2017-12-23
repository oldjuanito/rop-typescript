import { setErrorViewValuesStep } from '../../../../shared/src/commons/steps/setErrorViewValuesStep'
import { BasicComponent, ErrorReporterView } from '../components/BasicComponent'

export function createErrorRenderViewValuesStep<DomainType,
    InputType, ViewType, SupportingDataType>() {
    return setErrorViewValuesStep<BasicComponent<DomainType,
        InputType, ViewType, SupportingDataType>>((context) =>
        (context.view as {} as ErrorReporterView).currErrors as HTMLUListElement,
        (context) => context.currErrors)
}