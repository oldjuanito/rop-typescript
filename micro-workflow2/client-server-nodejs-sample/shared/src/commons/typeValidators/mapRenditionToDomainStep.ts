import { RenditionToDomainConverter, RenditionToDomainConverterHash, ResultForWorkflow } from '../editTypes'
import { fail, GOOD, pass, PropertyError } from '../rop/rop'

export interface ToDomainOptions<Rendition, Domain> {
    rendition: Rendition,
    propsToCheck: RenditionToDomainConverterHash,
    currDomain?: Domain
    // errorStoreFunc?: (errs: PropertyError[]) =>
}

export function toDomain<Rendition, Domain>(parameters: ToDomainOptions<Rendition, Domain>): ResultForWorkflow<Domain> {
    let {rendition, propsToCheck, currDomain} = parameters
    let errs: PropertyError[] = []
    const domainToModify = currDomain ? currDomain : {}
    for (var key in propsToCheck) {
        if (propsToCheck.hasOwnProperty(key)) {
            const propToCheck: RenditionToDomainConverter<{}, {}> = propsToCheck[key]
            const propResult = propToCheck(key, rendition[key])
            if (propResult.kind === GOOD) {
                domainToModify[key] = propResult.payload
            } else {
                errs = errs.concat(propResult.error)
            }

        }
    }
    if (errs.length > 0) {
        return fail(errs)
    } else {
        return pass(domainToModify as any as Domain)
    }
}

//
// export function mapRenditionToDomainStep<Context, Rendition, Domain>(stepName: string,
//                                                                      renditionGetter: (context: Context) => Rendition,
//                                                                      domainSetter: (context: Context, domain: Domain) => Context,
//                                                                      propHashCreator: (rendition: Rendition) => EditPropHash,
//                                                                      domainCreator: (propHash: EditPropHash) => Domain): SyncWorkflowStep<Context> {
//
//     const f = (context: Context): ResultForWorkflow<Context> => {
//         const c = toDomain(renditionGetter(context), propHashCreator, domainCreator)
//         switch (c.kind) {
//             case GOOD:
//                 return pass(domainSetter(context, c.payload))
//             default:
//                 return fail(c.error)
//         }
//
//     }
//     const step = createStepFunc<Context, Context, Context>({
//             func: f,
//             name: stepName
//         }
//     )
//     return step
// }