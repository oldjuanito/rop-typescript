import { SyncWorkflowStep } from '../workflowStep'
import { PropInfoTxtInput } from '../presentation/viewTypes'
import { pass } from '../rop/rop'
import { updateHtmlInput } from '../presentation/textInputUtils'
import { createStepFunc } from '../workflowStepMappers'

export function setInputTxtViewValuesStep<Context>(props: PropInfoTxtInput[],
                                                   viewGetter: ((context: Context) => {}),
                                                   renditionGetter: ((context: Context) => {})): SyncWorkflowStep<Context> {
    const f = (context: Context) => {

        const view = viewGetter(context)
        const rendition = renditionGetter(context)
        for (let propNameIdx = 0; propNameIdx < props.length; propNameIdx++) {
            const prop = props[propNameIdx];
            updateHtmlInput(view[prop.name], rendition[prop.name])
        }
        return pass(context)

    }
    const step = createStepFunc<Context, Context, Context>({
            func: f,
            name: 'setInputTxtViewValuesStep'
        }
    )
    return step
}