import { SyncWorkflowStep } from '../workflowStep'
import { createStepFunc } from '../workflowStepMappers'
import { fail, pass } from '../rop/rop'

export function failIfCollectionHasItemsStep<Context>(itemsGetter: ((context: Context) => [])
): SyncWorkflowStep<Context> {
    const f = (context: Context) => {

        const items = itemsGetter(context)
        if (items && items.length > 0) {
            return fail([{errorDescription: `collection contains items.`}])
        } else {
            return pass(context)
        }

    }
    const step = createStepFunc<Context, Context, Context>({
            func: f,
            name: 'failIfCollectionHasItemsStep'
        }
    )
    return step
}