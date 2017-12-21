import { InputMsg } from '../editTypes'
import { SyncWorkflowStep } from '../workflowStep'
import { createStepFunc } from '../workflowStepMappers'
import {  SimpleActionInfo } from '../presentation/viewTypes'
import { fail, pass } from '../rop/rop'

export function wireActionBtnStep<Context, ViewType>(formContainerId: string,
                                                     actions: SimpleActionInfo[],
                                                     callbackUiGetter: (context: Context) => ((msg: InputMsg) => void),
                                                     viewGetter: ((context: Context) => ViewType),
                                                     viewSetter: ((context: Context, view: ViewType) => Context)): SyncWorkflowStep<Context> {

    const f = (context: Context) => {

        const view = viewGetter(context)
        const uiSignalCallback = callbackUiGetter(context)
        for (let propNameIdx = 0; propNameIdx < actions.length; propNameIdx++) {
            const action = actions[propNameIdx];
            const elem = document.getElementById(formContainerId + '_' + action.name) as HTMLButtonElement

            if (!elem) {
                return fail([{errorDescription: `could not find ${formContainerId + '_' + action.name} button in DOM`}])
            }
            elem.addEventListener('click',ev => {
                uiSignalCallback(
                    {fieldName: action.name, newValue: action.value}
                )
            })
            view[action.name] = elem
        }

        return pass(viewSetter(context, view))

    }
    const step = createStepFunc<Context, Context, Context>({
            func: f,
            name: 'wireActionBtnStep'
        }
    )
    return step
}