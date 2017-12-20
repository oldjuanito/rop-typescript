import { DropDownChoice } from '../editTypes'

export interface PropInfoTxtInput {
    readonly name: string,
    readonly label: string,
    readonly primitiveType: 'text' | 'number' | 'tel' | 'email' | 'url',
}
export interface PropInfoTxtDisplay {
    readonly name: string,
}
export interface PropOptsDisplay<C> {
    readonly name: string,
    readonly opsGetter: (context:C) => DropDownChoice[]
}
export interface InputTxtView {
    readonly label: HTMLLabelElement,
    readonly field: HTMLSelectElement | HTMLInputElement,
}