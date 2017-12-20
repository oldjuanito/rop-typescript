import { SyncWorkflowStep } from '../workflowStep'
import {  PropOptsDisplay } from '../presentation/viewTypes'
import { createStepFunc } from '../workflowStepMappers'
import { pass } from '../rop/rop'
import { updateSelect } from '../presentation/dropdownUtils'

export function setDropDownViewOptsStep<Context, ViewType>(props: PropOptsDisplay<Context>[],
                                                              viewGetter: (context: Context) => ViewType): SyncWorkflowStep<Context> {
    const f = (context: Context) => {

        const view = viewGetter(context)
        for (let propNameIdx = 0; propNameIdx < props.length; propNameIdx++) {
            const prop = props[propNameIdx];
            const newOpts = prop.opsGetter(context)
            const selectElem = view[prop.name] as HTMLSelectElement
            updateSelect(selectElem.options, newOpts)
        }
        return pass(context)

    }
    const step = createStepFunc<Context, Context, Context>({
            func: f,
            name: 'setDropDownViewOptsStep'
        }
    )
    return step
}