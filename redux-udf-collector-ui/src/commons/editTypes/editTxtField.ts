// import { Descriptors } from '../types/primitiveDescriptors'
import { PropertyError,  RopResult, GOOD, BAD, getErrorsAsString } from '../rop/rop'
import { UserDefinedFieldDefinition } from '../types/userDefinedFieldDefinition'

export interface EditTextFieldDescriptor<T> {
    label: string
    fromRendition: (txtVal: string) => RopResult<T, PropertyError>
}
export interface EditTextFieldCurrVal {
    label: string
    currTxtVal: string
    currErrors: string[]
}

export function emptyEditTextFieldCurrVal(label: string): EditTextFieldCurrVal { 
    return {
    label,
    currTxtVal: '',
    currErrors: []
  }}
export function applyTextValue<T>(descriptor: EditTextFieldDescriptor<T>, newVal: string) {
    const result = descriptor.fromRendition(newVal)
    switch (result.kind) {
        case GOOD :
            const goodCurrVal: EditTextFieldCurrVal = { currTxtVal: newVal, currErrors: [], label: descriptor.label}
            return goodCurrVal
        case BAD :
            const badCurrVal: EditTextFieldCurrVal = { 
                currTxtVal: newVal, currErrors: getErrorsAsString([result.error]), label: descriptor.label}
            return badCurrVal
        default:
            const defaultCurrVal: EditTextFieldCurrVal = { currTxtVal: newVal, currErrors: [], label: descriptor.label}
            return defaultCurrVal
    }
}
export function createTxtValueApplier<T>(descriptor: EditTextFieldDescriptor<T>) {
    return (newVal: string) => applyTextValue<T>(descriptor, newVal)
}

export interface UdfStore {
    udfDescriptor: (newVal: string) => EditTextFieldCurrVal
    udfValue: EditTextFieldCurrVal
    udfField: UserDefinedFieldDefinition
}