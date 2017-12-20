import { SyncWorkflowStep } from '../workflowStep'
import { createStepFunc } from '../workflowStepMappers'
import { PropInfoTxtDisplay } from '../presentation/viewTypes'
import { pass } from '../rop/rop'
import { ResultForWorkflow } from '../editTypes'



export function wireDisplayElemViewStepFunc<Context, ViewType>(formContainerId: string,
                                                     propNames: PropInfoTxtDisplay[],
                                                     viewGetter: ((context: Context) => ViewType),
                                                     viewSetter: ((context: Context, view: ViewType) => Context))
: (context: Context) => ResultForWorkflow<Context>{

    return (context: Context) =>
    {
        const view = viewGetter(context) || {}
        for (let propNameIdx = 0; propNameIdx < propNames.length; propNameIdx++) {
            const prop = propNames[propNameIdx];
            const elem = document.getElementById(formContainerId + '_' + prop.name) as HTMLElement
            view[prop.name] = elem
        }

        return pass(viewSetter(context, view))
    }

}

export function wireDisplayElemViewStep<Context, ViewType>(formContainerId: string,
                                                     propNames: PropInfoTxtDisplay[],
                                                     viewGetter: ((context: Context) => ViewType),
                                                     viewSetter: ((context: Context, view: ViewType) => Context)): SyncWorkflowStep<Context> {

    const f = wireDisplayElemViewStepFunc(formContainerId, propNames, viewGetter, viewSetter)
    const step = createStepFunc<Context, Context, Context>({
            func: f,
            name: 'wireDisplayElemViewStep'
        }
    )
    return step
}