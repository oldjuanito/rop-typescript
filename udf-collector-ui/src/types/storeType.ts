// src/types/index.tsx
import {
    PrimitiveIdentifier,
    PrimitiveIdentifierConsts
} from '../commons/types/userDefinedFieldDefinition'
import { emptyEditTextFieldCurrVal, createTxtValueApplier, 
    UdfStore} from '../commons/editTypes/editTxtField'
import { RequiredChoice } from '../commons/types/requiredChoice'
import { RequiredShortAnswer } from '../commons/types/requiredShortAnswer';
import { RequiredAttachmentId } from '../commons/types/requiredAttachmentId';

export interface StoreState {
    languageName: string
    enthusiasmLevel: number
    udfStores: UdfStore[]
    // udfDescriptor: (bewVal: string) => EditTextFieldCurrVal
    // udfValues: EditTextFieldCurrVal[]
    // udfFields: UserDefinedFieldDefinition[]
}
function createFactory(primitiveType: PrimitiveIdentifier, choices: string[], propName: string) {

    switch (primitiveType) {
        case PrimitiveIdentifierConsts.Choices:
            const fromRendition = RequiredChoice.choicesConstructor(choices)
            return createTxtValueApplier({
                label: propName,
                fromRendition // RequiredShortAnswer.tryCreate
            })
        case PrimitiveIdentifierConsts.FileInput:
            return createTxtValueApplier({
                label: propName,
                fromRendition: RequiredAttachmentId.tryCreate
            })
        default:
            return createTxtValueApplier({
                label: propName,
                fromRendition: RequiredShortAnswer.tryCreate
            })
    }
}
function createSample(propName: string, primitiveType: PrimitiveIdentifier) {

    // const propName = 'lolo'
    const choices = ['car', 'bus', 'train']
    const store: UdfStore = {
        udfDescriptor : createFactory(primitiveType, choices, propName),
        udfValue : emptyEditTextFieldCurrVal(propName),
        udfField : { label : propName, primitiveType, options : choices  }
    }
    return store
}

export function createSampleUdfStores() {
    return [
        createSample('lol', PrimitiveIdentifierConsts.Choices),
        createSample('peter', PrimitiveIdentifierConsts.FileInput),
        createSample('name', PrimitiveIdentifierConsts.SingleLineText)
    ]
}