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

export interface SimpleActionInfo {
    readonly name: string,
    readonly value: string
}
export interface InputTxtView {
    readonly label: HTMLLabelElement,
    readonly field: HTMLSelectElement | HTMLInputElement,
}