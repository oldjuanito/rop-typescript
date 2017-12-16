import { createValidPropHash, EditPropHash } from './editPropHash'
import { ResultForWorkflow } from '../editTypes'
import { SyncWorkflowStep, WorkflowStep } from '../workflowStep'
import { fail, GOOD, pass } from '../rop/rop'
import { createStepFunc } from '../workflowStepMappers'

function toDomain<Rendition, Domain>(rendition: Rendition,
                                     propHashCreator: (rendition: Rendition) => EditPropHash,
                                     domainCreator: (propHash: EditPropHash) => Domain,): ResultForWorkflow<Domain> {
    const propsToCheck: EditPropHash = propHashCreator(rendition)
    const validPropHash: ResultForWorkflow<EditPropHash> = createValidPropHash(propsToCheck)
    switch (validPropHash.kind) {
        case GOOD:
            return pass(domainCreator(propsToCheck))
        default:
            return fail(validPropHash.error)
    }
}

export function mapRenditionToDomainStep<Context, Rendition, Domain>(stepName: string,
                                                                     renditionGetter: (context: Context) => Rendition,
                                                                     domainSetter: (context: Context, domain: Domain) => Context,
                                                                     propHashCreator: (rendition: Rendition) => EditPropHash,
                                                                     domainCreator: (propHash: EditPropHash) => Domain): SyncWorkflowStep<Context> {

    const f = (context: Context): ResultForWorkflow<Context> => {
        const c = toDomain(renditionGetter(context), propHashCreator, domainCreator)
        switch (c.kind) {
            case GOOD:
                return pass(domainSetter(context, c.payload))
            default:
                return fail(c.error)
        }

    }
    const step = createStepFunc<Context, Context, Context>({
            func: f,
            name: stepName
        }
    )
    return step
}