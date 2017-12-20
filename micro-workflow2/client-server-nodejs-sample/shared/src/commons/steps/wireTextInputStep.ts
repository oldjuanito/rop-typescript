import { PropInfoTxtInput } from '../presentation/viewTypes'
import { InputMsg } from '../editTypes'
import { SyncWorkflowStep } from '../workflowStep'
import { pass } from '../rop/rop'
import { createStepFunc } from '../workflowStepMappers'
import { addValueChgListener } from './createTextInputStep'

export function wireTextInputStep<Context, ViewType>(formContainerId: string,
                                                     propNames: PropInfoTxtInput[],
                                                     callbackUiGetter: (context: Context) => ((msg: InputMsg) => void),
                                                     viewGetter: ((context: Context) => ViewType),
                                                     viewSetter: ((context: Context, view: ViewType) => Context)): SyncWorkflowStep<Context> {

    const f = (context: Context) => {

        const view = viewGetter(context)
        for (let propNameIdx = 0; propNameIdx < propNames.length; propNameIdx++) {
            const prop = propNames[propNameIdx];
            const elem = document.getElementById(formContainerId + '_' + prop.name) as HTMLInputElement
            addValueChgListener(elem, prop.name, callbackUiGetter(context))
            view[prop.name] = elem
        }

        return pass(viewSetter(context, view))

    }
    const step = createStepFunc<Context, Context, Context>({
            func: f,
            name: 'wireTextInputStep'
        }
    )
    return step
}