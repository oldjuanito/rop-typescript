import { InputMsg } from '../editTypes'
import { SyncWorkflowStep } from '../workflowStep';
import { pass } from '../rop/rop'
import { InputTxtView, PropInfoTxtInput } from '../presentation/viewTypes'
import { createStepFunc } from '../workflowStepMappers'

export function addValueChgListener(elem: HTMLInputElement | HTMLSelectElement, fieldName: string,
                             callbackUi: (msg: InputMsg) => void) {

    elem.addEventListener('change',
        (_: Event) => {
            callbackUi({
                    fieldName: fieldName,
                    newValue: elem.value
                }
            )
        }
    )
}

export function wireTextInputStep<Context, ViewType>(formContainerId: string,
                                             propNames: PropInfoTxtInput[],
                                             callbackUiGetter: (context: Context) => ((msg: InputMsg) => void),
                                             viewGetter: ((context: Context) => ViewType),
                                             viewSetter: ((context: Context, view: ViewType) => Context)): SyncWorkflowStep<Context> {

    const f = (context: Context) => {

        const view = viewGetter(context)
        for (let propNameIdx = 0; propNameIdx < propNames.length; propNameIdx++) {
            const prop = propNames[propNameIdx];

            // const elemLbl = document.createElement('label')
            // elemLbl.htmlFor = formContainerId + '_' + prop.name

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
export function createTextInputStep<Context>(formContainerId: string,
                                             propNames: PropInfoTxtInput[],
                                             callbackUi: (msg: InputMsg) => void,
                                             viewGetter: ((context: Context) => {}),
                                             viewSetter: ((context: Context, view: {}) => Context)): SyncWorkflowStep<Context> {

    const f = (context: Context) => {

        const view = viewGetter(context)
        for (let propNameIdx = 0; propNameIdx < propNames.length; propNameIdx++) {
            const prop = propNames[propNameIdx];

            const elemLbl = document.createElement('label')
            elemLbl.htmlFor = formContainerId + '_' + prop.name

            const elem = document.createElement('input')
            elem.type = prop.primitiveType
            elem.id = formContainerId + '_' + prop.name
            addValueChgListener(elem, prop.name, callbackUi)

            const fieldContainer: InputTxtView = {
                label: elemLbl,
                field: elem
            }
            view[prop.name] = fieldContainer
        }

        return pass(viewSetter(context, view))

    }
    const step = createStepFunc<Context, Context, Context>({
            func: f,
            name: 'createTextInputStep'
        }
    )
    return step
}