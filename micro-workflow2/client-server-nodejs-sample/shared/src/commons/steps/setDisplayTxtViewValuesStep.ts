import { PropInfoTxtDisplay } from '../presentation/viewTypes'
import { SyncWorkflowStep } from '../workflowStep'
import { createStepFunc } from '../workflowStepMappers'
import { pass } from '../rop/rop'
import { updateHtmlInnerText } from '../presentation/elementUtils'

export function setDisplayTxtViewValuesStep<Context, ViewType, RenditionType>(props: PropInfoTxtDisplay[],
                                                   viewGetter: ((context: Context) => ViewType),
                                                   renditionGetter: ((context: Context) => RenditionType)): SyncWorkflowStep<Context> {
    const f = (context: Context) => {

        const view = viewGetter(context)
        const rendition = renditionGetter(context)
        for (let propNameIdx = 0; propNameIdx < props.length; propNameIdx++) {
            const prop = props[propNameIdx];
            updateHtmlInnerText(view[prop.name], rendition[prop.name])
        }
        return pass(context)

    }
    const step = createStepFunc<Context, Context, Context>({
            func: f,
            name: 'setDisplayTxtViewValuesStep'
        }
    )
    return step
}