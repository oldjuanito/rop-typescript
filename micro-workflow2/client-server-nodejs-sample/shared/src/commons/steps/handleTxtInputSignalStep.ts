import { fail, pass } from '../rop/rop'
import { createStepFunc } from '../workflowStepMappers'
import { SyncWorkflowStep } from '../workflowStep'
import { InputMsg } from '../editTypes'




export function handleTxtInputSignalStep<Context, RenditionType>(msgGetter: ((context: Context) => InputMsg),
                                                   renditionGetter: ((context: Context) => RenditionType),
                                                  renditionSetter: ((context: Context, newRendition: RenditionType) => Context)
                                                  ): SyncWorkflowStep<Context> {
    const f = (context: Context) => {

        const rendition = renditionGetter(context)
        const msg = msgGetter(context)
        if (rendition.hasOwnProperty(msg.fieldName)) {
            rendition[msg.fieldName] = msg.newValue
            return pass(renditionSetter(context,rendition))
        } else {
            return fail([{errorDescription: `prop: ${msg.fieldName} does not exist in ${JSON.stringify(rendition)}.`}])
        }

    }
    const step = createStepFunc<Context, Context, Context>({
            func: f,
            name: 'handleTxtInputSignalStep'
        }
    )
    return step
}