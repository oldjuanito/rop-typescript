import { SyncWorkflowStep } from '../workflowStep'
import { pass, PropertyError, fail } from '../rop/rop'
import { createStepFunc } from '../workflowStepMappers'

function clearTableBody(table: HTMLTableElement) {

    const bodies = table.tBodies
    if (bodies.length > 0) {
        while (bodies[0].rows.length > 0) {
            bodies[0].deleteRow(0)
        }
    } else {
        table.createTBody()
    }

}

export interface SetTableDataViewValuesStepParams<Context> {
    viewGetter: (context: Context) => HTMLTableElement,
    renditionGetter: (context: Context) => {}[]
}

export function setTableDataViewValuesStep<Context>(parameters: SetTableDataViewValuesStepParams<Context>): SyncWorkflowStep<Context> {
    let {viewGetter, renditionGetter} = parameters
    const f = (context: Context) => {

        const errors: PropertyError[] = []
        const view = viewGetter(context)
        const rendition = renditionGetter(context)
        const headers = view.tHead.rows[0].cells
        const propsToUse = []
        for (let headerIdx = 0; headerIdx < headers.length; headerIdx++) {
            const header = headers[headerIdx];
            const propName = header.getAttribute('data-prop-name')
            if (propName) {
                propsToUse.push(propName)
            }
        }

        clearTableBody(view)
        const tableBody = view.tBodies[0]
        for (let rowIdx = 0; rowIdx < rendition.length; rowIdx++) {
            const row = rendition[rowIdx]
            const newRow = tableBody.insertRow()
            for (let propNameIdx = 0; propNameIdx < propsToUse.length; propNameIdx++) {
                const propName = propsToUse[propNameIdx]
                if (row.hasOwnProperty(propName)) {
                    const newCell = newRow.insertCell()
                    newCell.innerText = row[propName]
                }
                else {
                    errors.push({errorDescription: `cell cannot use ${propName} as property value. It does not exist in ${JSON.stringify(row)}.`})
                }
            }
        }
        if (errors.length > 0) {
            return fail(errors)
        }
        return pass(context)

    }
    const step = createStepFunc<Context, Context, Context>({
            func: f,
            name: 'setTableDataViewValuesStep'
        }
    )
    return step
}