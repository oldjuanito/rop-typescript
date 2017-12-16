import { PropertyError, RopResult } from './rop/rop'

export interface InputMsg {
    readonly fieldName: string,
    readonly newValue: string
}

export interface DropDownChoice {
    readonly index: string,
    readonly label: string
}

export const NoEventMsg: InputMsg = {
    fieldName: 'None',
    newValue: '',

}
export type ResultForWorkflow<C> = RopResult<C, PropertyError[]>
export type EditProp<C> = {
    readonly errors: PropertyError[],
    readonly createFunc: (propName: string, context: EditProp<C>) => EditProp<C>
    readonly currRendition: string,
    goodVal?: C
}

export type RenditionToDomainConverter<Rendition, Domain> =
    (propName: string, context: Rendition) => ResultForWorkflow<Domain>


export interface RenditionToDomainConverterHash {
    [propName: string]: RenditionToDomainConverter<{}, {}>
}
