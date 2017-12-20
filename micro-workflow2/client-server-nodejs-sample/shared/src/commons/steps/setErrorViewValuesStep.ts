import { SyncWorkflowStep } from '../workflowStep'
import { pass, PropertyError } from '../rop/rop'
import { createStepFunc } from '../workflowStepMappers'
import { updateErrorList } from '../presentation/paragraphUtils'

export function setErrorViewValuesStep<Context>(viewGetter: ((context: Context) => HTMLUListElement),
                                                   renditionGetter: ((context: Context) => PropertyError[])): SyncWorkflowStep<Context> {
    const f = (context: Context) => {

        const view = viewGetter(context)
        const rendition = renditionGetter(context)
        updateErrorList(view, rendition)
        return pass(context)

    }
    const step = createStepFunc<Context, Context, Context>({
            func: f,
            name: 'setErrorViewValuesStep'
        }
    )
    return step
}