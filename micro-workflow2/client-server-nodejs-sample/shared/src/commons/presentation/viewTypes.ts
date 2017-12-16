export interface PropInfoTxtInput {
    readonly name: string,
    readonly label: string,
    readonly primitiveType: 'text' | 'number' | 'tel' | 'email' | 'url',
}

export interface InputTxtView {
    readonly label: HTMLLabelElement,
    readonly field: HTMLSelectElement | HTMLInputElement,
}